import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { router, type Href } from 'expo-router';
import { Platform } from 'react-native';
import type { DoseTiming } from '@/api/types';
import { t, type TranslationKey } from '@/i18n';

// Daily medicine reminders as phone notifications (they don't exist on the web).

export const remindersSupported = Platform.OS !== 'web';

const CHANNEL_ID = 'medicine-reminders';

const REMINDER_TIMES: Record<DoseTiming, { hour: number; label: TranslationKey }> = {
  morning: { hour: 8, label: 'dose.morning' },
  afternoon: { hour: 14, label: 'dose.afternoon' },
  night: { hour: 21, label: 'dose.night' },
};

// Called once when the app starts: show reminders even if the app is open.
export function setUpNotifications() {
  if (!remindersSupported) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// Tapping a reminder opens today's reminders screen. Returns a function that stops listening.
export function openRemindersOnTap(): () => void {
  if (!remindersSupported) return () => {};
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const url = response.notification.request.content.data?.url;
    if (typeof url === 'string') router.push(url as Href);
  });
  return () => subscription.remove();
}

// Asks for permission, then schedules one daily notification for each time of day
// that has medicines. Returns false if the user didn't allow notifications.
export async function scheduleReminders(timings: DoseTiming[]): Promise<boolean> {
  if (!remindersSupported) return false;

  const permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) return false;

  // Android groups notifications into channels the user can control in settings.
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Medicine reminders',
      importance: AndroidImportance.HIGH,
    });
  }

  await Notifications.cancelAllScheduledNotificationsAsync(); // start clean, no duplicates
  for (const timing of timings) {
    const { hour, label } = REMINDER_TIMES[timing];
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('reminders.notificationTitle', { time: t(label) }),
        body: t('reminders.notificationBody'),
        data: { url: '/reminders' },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute: 0, channelId: CHANNEL_ID },
    });
  }
  return true;
}

export async function cancelReminders(): Promise<void> {
  if (!remindersSupported) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}
