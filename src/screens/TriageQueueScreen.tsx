import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import DriverSelectDropdown from '../components/DriverSelectDropdown';
import { styles } from './TriageQueueScreen.styles';

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
	// Keep track of the typing input text state independently for each triage row item
	const [rowInputs, setRowInputs] = useState<Record<string, string>>({});

	if (unassignedItems.length === 0) return null;

	const handleRowTextChange = (itemId: string, text: string) => {
		setRowInputs(prev => ({ ...prev, [itemId]: text }));
	};

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
				These expenses couldn't be matched automatically. Assign a driver via
				the lookup tool to process them.
			</Text>
			<View style={styles.divider} />

			<ScrollView nestedScrollEnabled style={styles.listContainer}>
				{unassignedItems.map(item => {
					const currentInputValue = rowInputs[item.id] || '';

					return (
						<View
							key={item.id}
							style={[styles.triageItemRow, { zIndex: 9999 }]}
						>
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

							{/* Clean, scalable Dropdown Selection Block */}
							<View style={[styles.actionColumn, { minWidth: 220 }]}>
								<Text style={styles.assignLabel}>Assign Driver:</Text>
								<View
									style={{
										width: '100%',
										flexDirection: 'row',
										gap: 6,
										alignItems: 'flex-start'
									}}
								>
									<View style={{ flex: 1 }}>
										<DriverSelectDropdown
											value={currentInputValue}
											onChangeText={txt => handleRowTextChange(item.id, txt)}
											suggestions={drivers}
											placeholder="Select driver..."
										/>
									</View>
									{currentInputValue.trim().length > 0 && (
										<TouchableOpacity
											style={[
												styles.pillBtn,
												{
													backgroundColor: '#34C759',
													borderColor: '#34C759',
													height: 44,
													justifyContent: 'center'
												}
											]}
											onPress={() => {
												onAssignItem(item.id, currentInputValue.trim());
												// Clear local tracker row entry value out after execution runs
												handleRowTextChange(item.id, '');
											}}
										>
											<Text
												style={[styles.pillBtnText, { fontWeight: 'bold' }]}
											>
												Save
											</Text>
										</TouchableOpacity>
									)}
								</View>
							</View>
						</View>
					);
				})}
			</ScrollView>
		</View>
	);
}
