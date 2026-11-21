import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Button, EmptyState, StatusIcon } from '@/components';
import { useT } from '@/i18n';
import { newBookingId, useBookings, type Booking } from '@/store/bookings';
import { useTheme } from '@/theme/ThemeProvider';
import { formatRupees, formatSlot } from '@/utils/format';

// Shown right after "Confirm". The booking is already saved on the phone as
// "confirming"; this screen updates by itself when the server answers.
export function BookingStatusView() {
  const { spacing } = useTheme();
  const t = useT();
  const insets = useSafeAreaInsets();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const booking = useBookings((s) => s.bookings.find((b) => b.id === bookingId));
  const removeBooking = useBookings((s) => s.removeBooking);
  const bookSlot = useBookings((s) => s.bookSlot);

  // A small buzz when the answer arrives.
  useEffect(() => {
    if (booking?.status === 'confirmed') void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (booking?.status === 'failed') void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, [booking?.status]);

  if (!booking) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top, padding: spacing.lg }]}>
        <EmptyState
          icon="help-circle-outline"
          title={t('status.notFoundTitle')}
          message={t('status.notFoundMessage')}
          actionLabel={t('status.goHome')}
          onAction={() => router.dismissTo('/')}
        />
      </View>
    );
  }

  function pickAnotherTime(failed: Booking) {
    removeBooking(failed.id);
    router.back();
  }

  function tryAgain(failed: Booking) {
    removeBooking(failed.id);
    const id = newBookingId();
    void bookSlot({ ...failed, id });
    router.replace(`/booking/${id}`);
  }

  const text = {
    confirming: { title: t('status.confirmingTitle'), message: t('status.confirmingMessage') },
    confirmed: { title: t('status.confirmedTitle'), message: t('status.bookingId', { id: booking.serverId ?? '' }) },
    failed:
      booking.failure === 'slot_taken'
        ? { title: t('status.slotTakenTitle'), message: t('status.slotTakenMessage') }
        : { title: t('status.failedTitle'), message: t('status.failedMessage') },
  }[booking.status];

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.lg, paddingHorizontal: spacing.lg },
      ]}
    >
      <View style={[styles.center, { gap: spacing.md }]}>
        <StatusIcon status={booking.status} />
        <AppText variant="title" style={styles.centerText} accessibilityLiveRegion="polite">
          {text.title}
        </AppText>
        <AppText color="textSecondary" style={styles.centerText}>
          {text.message}
        </AppText>

        <View style={{ alignItems: 'center', gap: spacing.xs, marginTop: spacing.lg }}>
          <AppText variant="bodyBold">{booking.doctorName}</AppText>
          <AppText color="textSecondary">{booking.serviceName ?? booking.specialty}</AppText>
          <AppText variant="bodyBold" color="primary">
            {formatSlot(booking.startsAt)}
            {booking.priceInr > 0 ? ` · ${formatRupees(booking.priceInr)}` : ''}
          </AppText>
        </View>
      </View>

      <View style={{ gap: spacing.sm }}>
        {booking.status === 'failed' && booking.failure === 'other' && (
          <Button label={t('common.tryAgain')} onPress={() => tryAgain(booking)} />
        )}
        {booking.status === 'failed' && (
          <Button
            label={t('status.pickAnotherTime')}
            variant={booking.failure === 'slot_taken' ? 'primary' : 'outline'}
            onPress={() => pickAnotherTime(booking)}
          />
        )}
        {booking.status !== 'failed' && (
          <>
            <Button label={t('status.viewBookings')} onPress={() => router.dismissTo('/bookings')} />
            <Button label={t('status.backHome')} variant="outline" onPress={() => router.dismissTo('/')} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'space-between' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centerText: { textAlign: 'center' },
});
