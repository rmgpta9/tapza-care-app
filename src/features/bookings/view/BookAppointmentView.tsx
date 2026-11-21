import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDoctors, useSlots } from '@/api/queries';
import type { Slot } from '@/api/types';
import {
  AppText,
  BottomSheet,
  Button,
  Card,
  DateStrip,
  DoctorAvatar,
  EmptyState,
  Notice,
  Skeleton,
  SlotGrid,
} from '@/components';
import { newBookingId, useBookings } from '@/store/bookings';
import { useTheme } from '@/theme/ThemeProvider';
import { addDays, today } from '@/utils/date';
import { dayParts, formatRupees, formatTime } from '@/utils/format';

const DAYS_AHEAD = 7;

// Book a visit: pick a date, pick a time in the bottom sheet, confirm.
// Opened from a doctor card, or from a service card (which adds the service name and price).
export function BookAppointmentView() {
  const { colors, spacing } = useTheme();
  const params = useLocalSearchParams<{ doctorId: string; serviceName?: string; priceInr?: string }>();
  const { data: doctors, isLoading: doctorsLoading } = useDoctors();
  const bookSlot = useBookings((s) => s.bookSlot);

  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const slots = useSlots(params.doctorId, date);

  const doctor = doctors?.find((d) => d.id === params.doctorId);
  const price = params.priceInr ? Number(params.priceInr) : (doctor?.feeInr ?? 0);
  const dates = Array.from({ length: DAYS_AHEAD }, (_, i) => addDays(today(), i));
  const lastDate = dates[dates.length - 1];

  function pickDate(newDate: string) {
    setDate(newDate);
    setSlot(null);
    setSheetOpen(true);
  }

  function confirm() {
    if (!doctor || !slot) return;
    const id = newBookingId();
    // Not awaited on purpose: the booking shows straight away as "confirming"
    // and the next screen updates when the server answers.
    void bookSlot({
      id,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      slotId: slot.id,
      startsAt: slot.startsAt,
      priceInr: price,
      serviceName: params.serviceName,
    });
    setSheetOpen(false);
    router.push(`/booking/${id}`);
  }

  if (doctorsLoading) {
    return (
      <View style={{ padding: spacing.lg, gap: spacing.md }}>
        <Stack.Screen options={{ headerShown: true, title: 'Book a visit' }} />
        <Skeleton width="100%" height={120} />
        <Skeleton width="40%" height={18} />
        <Skeleton width="100%" height={64} />
      </View>
    );
  }

  if (!doctor) {
    return (
      <View style={{ padding: spacing.lg }}>
        <Stack.Screen options={{ headerShown: true, title: 'Book a visit' }} />
        <EmptyState
          icon="person-outline"
          title="Doctor not found"
          message="This doctor isn't available right now."
          actionLabel="See all doctors"
          onAction={() => router.replace('/doctors')}
        />
      </View>
    );
  }

  const dateLabel = date ? `${dayParts(date).label} ${dayParts(date).day}` : '';

  return (
    <View style={styles.fill}>
      <Stack.Screen options={{ headerShown: true, title: 'Book a visit' }} />

      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <Card style={{ gap: spacing.md }}>
          <View style={[styles.row, { gap: spacing.md }]}>
            <DoctorAvatar name={doctor.name} photoUrl={doctor.photoUrl} size={64} />
            <View style={styles.fill}>
              <AppText variant="heading">{doctor.name}</AppText>
              <AppText color="textSecondary">{doctor.specialty}</AppText>
            </View>
          </View>
          {doctor.clinicName && (
            <AppText variant="small" color="textSecondary">
              {doctor.clinicName}
            </AppText>
          )}
          <AppText variant="small" color="textSecondary">
            Speaks {doctor.languages.join(', ')}
            {doctor.experienceYears ? ` · ${doctor.experienceYears} years experience` : ''}
          </AppText>
        </Card>

        {params.serviceName && (
          <Card style={[styles.row, { gap: spacing.md, backgroundColor: colors.primarySoft }]}>
            <AppText variant="bodyBold" style={styles.fill}>
              {params.serviceName}
            </AppText>
            <AppText variant="bodyBold" color="primary">
              {formatRupees(price)}
            </AppText>
          </Card>
        )}

        <View style={{ gap: spacing.sm }}>
          <AppText variant="heading">Choose a date</AppText>
          <AppText variant="small" color="textSecondary">
            Pick a day to see open times.
          </AppText>
        </View>
        <DateStrip dates={dates} selected={date} onSelect={pickDate} />
      </ScrollView>

      <BottomSheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <View style={{ gap: spacing.lg }}>
          <AppText variant="heading">
            {dateLabel} · {doctor.name}
          </AppText>

          {slots.isLoading && (
            <View style={[styles.wrap, { gap: spacing.sm }]}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} width="22.5%" height={48} />
              ))}
            </View>
          )}

          {slots.error && (
            <Notice message="Couldn't load times." actionLabel="Retry" onAction={() => slots.refetch()} />
          )}

          {slots.data?.length === 0 && (
            <EmptyState
              icon="calendar-clear-outline"
              title="No open times"
              message="The clinic is closed or fully booked on this day."
              actionLabel={date && date !== lastDate ? 'Try the next day' : undefined}
              onAction={date && date !== lastDate ? () => pickDate(addDays(date, 1)) : undefined}
            />
          )}

          {slots.data && slots.data.length > 0 && (
            <SlotGrid slots={slots.data} selectedId={slot?.id ?? null} onSelect={setSlot} />
          )}

          <Button
            label={slot ? `Confirm ${formatTime(slot.startsAt)} · ${formatRupees(price)}` : 'Select a time'}
            onPress={confirm}
            disabled={!slot}
          />
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
});
