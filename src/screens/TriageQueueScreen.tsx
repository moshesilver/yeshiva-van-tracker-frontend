import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	ScrollView
} from 'react-native';

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

const styles = StyleSheet.create({
	triageCard: {
		backgroundColor: '#3A2E2B', // Distinct subtle warm/amber tint for warnings
		borderWidth: 1,
		borderColor: '#FF9500',
		borderRadius: 12,
		padding: 18,
		marginBottom: 20,
		width: '100%'
	},
	headerAlertRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10
	},
	triageTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#FF9500'
	},
	badge: {
		backgroundColor: '#FF9500',
		borderRadius: 10,
		paddingHorizontal: 8,
		paddingVertical: 2
	},
	badgeText: {
		color: '#1C1C1E',
		fontWeight: 'bold',
		fontSize: 12
	},
	subtext: {
		color: '#E5E5EA',
		fontSize: 13,
		marginTop: 4,
		lineHeight: 18
	},
	divider: {
		height: 1,
		backgroundColor: 'rgba(255, 149, 0, 0.2)',
		marginVertical: 12
	},
	listContainer: {
		maxHeight: 280
	},
	triageItemRow: {
		backgroundColor: '#2C2C2E',
		borderRadius: 8,
		padding: 12,
		marginBottom: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexWrap: 'wrap',
		gap: 12
	},
	metaDataBlock: {
		flex: 1,
		minWidth: 200
	},
	itemMainText: {
		color: '#FFFFFF',
		fontSize: 15,
		fontWeight: '600'
	},
	price: {
		color: '#FF453A',
		fontWeight: 'bold'
	},
	itemTimeText: {
		color: '#AEAEB2',
		fontSize: 12,
		marginTop: 2
	},
	itemNoteText: {
		color: '#E5E5EA',
		fontSize: 12,
		fontStyle: 'italic',
		marginTop: 4
	},
	actionColumn: {
		alignItems: 'flex-start'
	},
	assignLabel: {
		color: '#AEAEB2',
		fontSize: 11,
		marginBottom: 4,
		textTransform: 'uppercase'
	},
	driverButtonGrid: {
		flexDirection: 'row',
		gap: 6,
		flexWrap: 'wrap'
	},
	pillBtn: {
		backgroundColor: '#48484A',
		borderRadius: 6,
		paddingVertical: 4,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: '#545456'
	},
	pillBtnText: {
		color: '#FFFFFF',
		fontSize: 12,
		fontWeight: '500'
	}
});
