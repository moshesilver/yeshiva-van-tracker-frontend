import { styles } from './TriageQueueScreen.styles';

import { Text, View, TouchableOpacity, ScrollView } from 'react-native';

interface TriageExpense {
	id: string;
	type: string;
	amount: number;
	dateTime: string;
	notes: string | null;
}

interface DriverOption {
	id: string;
	name: string;
}

interface TriageQueueScreenProps {
	unassignedItems: TriageExpense[];
	drivers: DriverOption[];
	onAssignItem: (expenseId: string, targetDriverName: string) => void;
}

export default function TriageQueueScreen({
	unassignedItems,
	drivers,
	onAssignItem
}: TriageQueueScreenProps) {
	if (unassignedItems.length === 0) return null;

	return (
		<View style={styles.triageCard}>
			<View style={styles.headerAlertRow}>
				<Text style={styles.triageTitle}>
					🚨 Action Required: Unassigned Logs
				</Text>
				<View style={styles.badge}>
					<Text style={styles.badgeText}>{unassignedItems.length}</Text>
				</View>
			</View>
			<Text style={styles.subtext}>
				These expenses couldn't be matched automatically to a trip. Assign a
				driver manually to link them.
			</Text>
			<View style={styles.divider} />

			<ScrollView nestedScrollEnabled style={styles.listContainer}>
				{unassignedItems.map(item => (
					<View key={item.id} style={styles.triageItemRow}>
						<View style={styles.metaDataBlock}>
							<Text style={styles.itemMainText}>
								{item.type} —{' '}
								<Text style={styles.price}>${item.amount.toFixed(2)}</Text>
							</Text>
							<Text style={styles.itemTimeText}>
								{new Date(item.dateTime).toLocaleString()}
							</Text>
							{item.notes && (
								<Text style={styles.itemNoteText}>“{item.notes}”</Text>
							)}
						</View>

						{/* Quick Picker Column */}
						<View style={styles.actionColumn}>
							<Text style={styles.assignLabel}>Assign To:</Text>
							<View style={styles.driverButtonGrid}>
								{drivers
									.filter(d => d.name !== 'Unassigned Fleet Driver')
									.slice(0, 3) // Shows the first 3 drivers cleanly as click pills
									.map(driver => (
										<TouchableOpacity
											key={driver.id}
											style={styles.pillBtn}
											onPress={() => onAssignItem(item.id, driver.name)}
										>
											<Text style={styles.pillBtnText}>+ {driver.name}</Text>
										</TouchableOpacity>
									))}
							</View>
						</View>
					</View>
				))}
			</ScrollView>
		</View>
	);
}
