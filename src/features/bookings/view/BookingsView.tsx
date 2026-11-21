import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card, EmptyState, Screen } from '@/components';
import { useBookings, type Booking } from '@/store/bookings';
import { useTheme } from '@/theme/ThemeProvider';
import { formatRupees, formatSlot } from '@/utils/format';

// The Bookings tab: visits the user has booked, soonest first.
// Failed bookings aren't shown; the user already saw that on the booking screen.
export function BookingsView() {
  const { spacing } = useTheme();
  const bookings = useBookings((s) => s.bookings)
    .filter((b) => b.status !== 'failed')
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  return (
    <Screen title="Bookings" subtitle="Your upcoming visits">
      {bookings.length === 0 ? (
        <EmptyState
          icon="calendar-outline"
          title="No visits booked yet"
          message="Book a doctor or a lab test and it will show up here."
          actionLabel="Book a visit"
          onAction={() => router.push('/doctors')}
        />
      ) : (
        <>
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
          <View style={{ marginTop: spacing.sm }}>
            <Button label="Book another visit" variant="outline" icon="add" onPress={() => router.push('/doctors')} />
          </View>
        </>
      )}
    </Screen>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const { colors, spacing, radius } = useTheme();
  const confirmed = booking.status === 'confirmed';

  return (
    <Card style={{ gap: spacing.xs }}>
      <View style={styles.row}>
        <AppText variant="heading" style={styles.flex}>
          {formatSlot(booking.startsAt)}
        </AppText>
        <View
          style={{
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
            borderRadius: radius.sm,
            backgroundColor: confirmed ? colors.successSoft : colors.primarySoft,
          }}
        >
          <AppText variant="label" color={confirmed ? 'success' : 'primary'}>
            {confirmed ? 'Confirmed' : 'Confirming…'}
          </AppText>
        </View>
      </View>
      <AppText variant="bodyBold">{booking.doctorName}</AppText>
      <AppText color="textSecondary">
        {booking.serviceName ?? booking.specialty}
        {booking.priceInr > 0 ? ` · ${formatRupees(booking.priceInr)}` : ''}
      </AppText>
      {booking.serverId && (
        <AppText variant="small" color="textSecondary">
          Booking ID {booking.serverId}
        </AppText>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
});
