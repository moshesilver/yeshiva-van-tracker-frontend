import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	FlatList,
	ScrollView
} from 'react-native';
import { api, DriverMetrics } from './src/services/api';
import TriageQueueScreen from './src/screens/TriageQueueScreen';

interface Trip {
	id: string;
	startDateTime: string;
	notes: string | null;
	driver: {
		name: string;
	};
}

const getCurrentDateTimeLocal = () => {
	const now = new Date();
	const offset = now.getTimezoneOffset() * 60000;
	return new Date(now.getTime() - offset).toISOString().slice(0, 16);
};

export default function App() {
	const [serverStatus, setServerStatus] = useState('Checking...');
	const [trips, setTrips] = useState<Trip[]>([]);
	const [drivers, setDrivers] = useState<DriverMetrics[]>([]);
	const [unassignedExpenses, setUnassignedExpenses] = useState([]);

	// Login States
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [passwordInput, setPasswordInput] = useState('');
	const [loginError, setLoginError] = useState('');
	const [loginLoading, setLoginLoading] = useState(false);

	// Trip States
	const [driverName, setDriverName] = useState('');
	const [tripDateTime, setTripDateTime] = useState(getCurrentDateTimeLocal());
	const [tripNotes, setTripNotes] = useState('');
	const [tripLoading, setTripLoading] = useState(false);
	const [tripMessage, setTripMessage] = useState('');

	// Expense States
	const [expType, setExpType] = useState('Toll');
	const [expAmount, setExpAmount] = useState('');
	const [expDateTime, setExpDateTime] = useState(getCurrentDateTimeLocal());
	const [manualDriver, setManualDriver] = useState('');
	const [expNotes, setExpNotes] = useState('');
	const [expLoading, setExpLoading] = useState(false);
	const [expMessage, setExpMessage] = useState('');

	// 🔍 Suggestion Engine UI States
	const [suggestedTrip, setSuggestedTrip] = useState<any | null>(null);

	useEffect(() => {
		api.checkHealth().then(data => setServerStatus(data.status));
		refreshDashboardData();
	}, []);

	// Whenever the incident date time changes, see if we can find a matching driver suggestion
	useEffect(() => {
		if (!manualDriver) {
			triggerDriverSuggestionCheck();
		}
	}, [expDateTime, manualDriver]);

	const refreshDashboardData = async () => {
		const [tripsData, driversData, unassignedData] = await Promise.all([
			api.getTrips(),
			api.getDrivers(),
			api.getUnassignedExpenses()
		]);
		setTrips(tripsData);
		setDrivers(driversData);
		setUnassignedExpenses(unassignedData.expenses);
	};

	const triggerDriverSuggestionCheck = async () => {
		try {
			const isoTarget = new Date(expDateTime).toISOString();
			const match = await api.matchDriverByTime(isoTarget);
			setSuggestedTrip(match || null);
		} catch {
			setSuggestedTrip(null);
		}
	};

	const handleLogTrip = async () => {
		if (!driverName.trim()) {
			setTripMessage('⚠️ Please enter or select a driver name!');
			return;
		}
		setTripLoading(true);
		setTripMessage('');
		try {
			const customISO = new Date(tripDateTime).toISOString();
			await api.createTrip(driverName.trim(), tripNotes, customISO);

			setTripMessage(`✅ Success: Assigned keys to ${driverName}!`);
			setDriverName('');
			setTripNotes('');
			setTripDateTime(getCurrentDateTimeLocal());
			await refreshDashboardData();
		} catch (err) {
			setTripMessage('❌ Save failed.');
		} finally {
			setTripLoading(false);
		}
	};

	const handleLogExpense = async () => {
		if (!expAmount.trim()) {
			setExpMessage('⚠️ Please enter an amount!');
			return;
		}
		setExpLoading(true);
		setExpMessage('');

		try {
			const targetISO = new Date(expDateTime).toISOString();

			await api.createExpense({
				type: expType,
				amount: expAmount,
				dateTime: targetISO,
				status: 'Unpaid',
				notes: expNotes,
				tripId: null, // Cleared out since backend calculates relationship mapping based on properties below
				manualDriverName: manualDriver || undefined
			});

			setExpMessage('✅ Expense successfully written to database logs!');
			setExpAmount('');
			setExpNotes('');
			setManualDriver('');
			setSuggestedTrip(null);
			setExpDateTime(getCurrentDateTimeLocal());
			await refreshDashboardData();
		} catch (err) {
			setExpMessage('❌ Failed to save expense.');
		} finally {
			setExpLoading(false);
		}
	};

	// Direct Assign callback used inside our triage list row item view
	const handleQuickAssignUnassignedItem = async (
		expenseId: string,
		targetDriverName: string
	) => {
		try {
			// Re-route item by posting direct override params onto existing log
			await fetch(`http://localhost:5000/api/expenses`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: expenseId, // Reuses existing schema key to drop/re-add or update fields nicely
					manualDriverName: targetDriverName
				})
			});
			await refreshDashboardData();
		} catch (error) {
			console.error('Failed to correct item assignments:', error);
		}
	};

	const handleLoginSubmit = async () => {
		if (!passwordInput.trim()) return;
		setLoginLoading(true);
		setLoginError('');
		try {
			const res = await api.login(passwordInput);
			if (res.success) {
				setIsAuthenticated(true);
				// Kick off the data loading once inside
				refreshDashboardData();
			} else {
				setLoginError(res.message || 'Incorrect password.');
			}
		} catch (err) {
			setLoginError('Could not connect to authentication server.');
		} finally {
			setLoginLoading(false);
		}
	};

	const formatDateTime = (dateString: string) => {
		const d = new Date(dateString);
		return (
			d.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			}) +
			' @ ' +
			d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
		);
	};

	if (!isAuthenticated) {
		return (
			<View style={styles.loginContainer}>
				<View style={styles.loginCard}>
					<Text style={styles.loginTitle}>🔒 Yeshiva Van Tracker</Text>
					<Text style={styles.loginSubtitle}>
						Enter password to access the monitoring dashboard
					</Text>
					<View style={styles.divider} />

					<TextInput
						style={styles.input}
						placeholder="Enter security password"
						placeholderTextColor="#8E8E93"
						secureTextEntry
						value={passwordInput}
						onChangeText={setPasswordInput}
						onSubmitEditing={handleLoginSubmit}
					/>

					<TouchableOpacity
						style={styles.button}
						onPress={handleLoginSubmit}
						disabled={loginLoading}
					>
						{loginLoading ? (
							<ActivityIndicator color="#fff" />
						) : (
							<Text style={styles.buttonText}>Unlock Dashboard</Text>
						)}
					</TouchableOpacity>

					{loginError ? (
						<Text style={styles.errorText}>{loginError}</Text>
					) : null}
				</View>
			</View>
		);
	}

	return (
		<ScrollView contentContainerStyle={styles.scrollContainer}>
			<View style={styles.layoutWrapper}>
				{/* TRIAGE WARNING BANNER: Spans across layout whenever anomalies hit */}
				<TriageQueueScreen
					unassignedItems={unassignedExpenses}
					drivers={drivers}
					onAssignItem={handleQuickAssignUnassignedItem}
				/>

				{/* LEFT COLUMN: Input Control Cards */}
				<View style={styles.column}>
					{/* Card A: Assign Van Keys */}
					<View style={styles.card}>
						<Text style={styles.title}>🚐 Key Assignment</Text>
						<Text style={styles.statusText}>Server Status: {serverStatus}</Text>
						<View style={styles.divider} />

						<Text style={styles.inlineLabel}>Select or Type Driver Name:</Text>
						<TextInput
							style={styles.input}
							placeholder="Type driver name..."
							placeholderTextColor="#8E8E93"
							value={driverName}
							onChangeText={setDriverName}
						/>

						{drivers.length > 0 && (
							<View style={styles.tagWrapper}>
								{drivers
									.filter(d => d.name !== 'Unassigned Fleet Driver')
									.map(d => (
										<TouchableOpacity
											key={d.id}
											style={styles.tag}
											onPress={() => setDriverName(d.name)}
										>
											<Text style={styles.tagText}>+ {d.name}</Text>
										</TouchableOpacity>
									))}
							</View>
						)}

						<Text style={styles.inlineLabel}>Checkout Date & Time:</Text>
						<input
							id="checkout-datetime"
							type="datetime-local"
							title="Select checkout date and time"
							value={tripDateTime}
							onChange={e => setTripDateTime(e.target.value)}
							style={styles.webDatePicker}
						/>

						<TextInput
							style={[styles.input, styles.textArea]}
							placeholder="Trip scope/notes (optional)"
							placeholderTextColor="#8E8E93"
							value={tripNotes}
							onChangeText={setTripNotes}
							multiline
						/>
						<TouchableOpacity
							style={styles.button}
							onPress={handleLogTrip}
							disabled={tripLoading}
						>
							{tripLoading ? (
								<ActivityIndicator color="#fff" />
							) : (
								<Text style={styles.buttonText}>Assign Keys</Text>
							)}
						</TouchableOpacity>
						{tripMessage ? (
							<Text style={styles.messageText}>{tripMessage}</Text>
						) : null}
					</View>

					{/* Card B: Log Expense / Tickets */}
					<View style={styles.card}>
						<Text style={styles.title}>💳 Log Expense / Ticket</Text>
						<View style={styles.divider} />

						<View style={styles.typeRow}>
							{['Toll', 'Ticket', 'Gas'].map(t => (
								<TouchableOpacity
									key={t}
									style={[
										styles.typeButton,
										expType === t && styles.typeButtonActive
									]}
									onPress={() => setExpType(t)}
								>
									<Text
										style={[
											styles.typeButtonText,
											expType === t && styles.typeButtonTextActive
										]}
									>
										{t}
									</Text>
								</TouchableOpacity>
							))}
						</View>

						<TextInput
							style={styles.input}
							placeholder="Amount ($)"
							placeholderTextColor="#8E8E93"
							keyboardType="numeric"
							value={expAmount}
							onChangeText={setExpAmount}
						/>

						<Text style={styles.inlineLabel}>Date & Time of Incident:</Text>
						<input
							id="expense-datetime"
							type="datetime-local"
							title="Select expense date and time"
							value={expDateTime}
							onChange={e => setExpDateTime(e.target.value)}
							style={styles.webDatePicker}
						/>

						{/* THE INTERACTIVE SUGGESTION DIALOG PROMPT */}
						{suggestedTrip && (
							<View style={styles.suggestionAlertBox}>
								<Text style={styles.suggestionTitleText}>
									🔍 Trip Match Found
								</Text>
								<Text style={styles.suggestionBodyText}>
									It looks like{' '}
									<Text style={styles.bold}>{suggestedTrip.driver?.name}</Text>{' '}
									had keys checked out at this timestamp.
								</Text>
								<TouchableOpacity
									style={styles.acceptSuggestionBtn}
									onPress={() =>
										setManualDriver(suggestedTrip.driver?.name || '')
									}
								>
									<Text style={styles.acceptBtnText}>
										Link to {suggestedTrip.driver?.name}
									</Text>
								</TouchableOpacity>
							</View>
						)}

						<Text style={styles.inlineLabel}>
							Assign Driver (Leave blank to flag as unassigned):
						</Text>
						<TextInput
							style={styles.input}
							placeholder="Driver assignment override..."
							placeholderTextColor="#8E8E93"
							value={manualDriver}
							onChangeText={setManualDriver}
						/>

						{drivers.length > 0 && (
							<View style={styles.tagWrapper}>
								{drivers
									.filter(d => d.name !== 'Unassigned Fleet Driver')
									.map(d => (
										<TouchableOpacity
											key={d.id}
											style={[
												styles.tag,
												manualDriver === d.name && styles.tagSelected
											]}
											onPress={() => setManualDriver(d.name)}
										>
											<Text style={styles.tagText}>{d.name}</Text>
										</TouchableOpacity>
									))}
							</View>
						)}

						<TextInput
							style={[styles.input, styles.textArea, styles.extraSpacingTop]}
							placeholder="Expense notes (e.g. GWB Toll Lane 4)"
							placeholderTextColor="#8E8E93"
							value={expNotes}
							onChangeText={setExpNotes}
							multiline
						/>

						<TouchableOpacity
							style={[styles.button, styles.successButton]}
							onPress={handleLogExpense}
							disabled={expLoading}
						>
							{expLoading ? (
								<ActivityIndicator color="#fff" />
							) : (
								<Text style={styles.buttonText}>Save Expense Log</Text>
							)}
						</TouchableOpacity>
						{expMessage ? (
							<Text style={styles.messageText}>{expMessage}</Text>
						) : null}
					</View>
				</View>

				{/* RIGHT COLUMN: History Log */}
				<View style={styles.column}>
					<View style={[styles.card, styles.flexibleHeight]}>
						<Text style={styles.sectionTitle}>📅 Live Key Status Feed</Text>
						<View style={styles.divider} />

						{trips.length === 0 ? (
							<Text style={styles.emptyText}>No active trips recorded.</Text>
						) : (
							<FlatList
								data={trips}
								keyExtractor={item => item.id}
								renderItem={({ item }) => (
									<View style={styles.tripItem}>
										<View style={styles.tripHeader}>
											<Text style={styles.driverText}>
												{item.driver?.name || 'Unknown'}
											</Text>
											<Text style={styles.dateText}>
												{formatDateTime(item.startDateTime)}
											</Text>
										</View>
										{item.notes ? (
											<Text style={styles.noteText}>“{item.notes}”</Text>
										) : null}
									</View>
								)}
							/>
						)}
					</View>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	scrollContainer: { flexGrow: 1, backgroundColor: '#1C1C1E', padding: 20 },
	layoutWrapper: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		gap: 20,
		width: '100%',
		maxWidth: 1100,
		alignSelf: 'center'
	},
	column: { flex: 1, minWidth: 340, maxWidth: 520, gap: 20 },
	card: { backgroundColor: '#2C2C2E', borderRadius: 12, padding: 22 },
	flexibleHeight: { flex: 1 },
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		color: '#FFFFFF',
		marginBottom: 4
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#FFFFFF',
		marginBottom: 4
	},
	statusText: { color: '#AEAEB2', fontSize: 13, marginBottom: 10 },
	divider: { height: 1, backgroundColor: '#3A3A3C', marginBottom: 16 },
	inlineLabel: {
		color: '#AEAEB2',
		fontSize: 13,
		fontWeight: '500',
		marginBottom: 6,
		marginTop: 4
	},
	input: {
		backgroundColor: '#3A3A3C',
		borderRadius: 8,
		color: '#FFFFFF',
		padding: 12,
		fontSize: 16,
		marginBottom: 10
	},
	webDatePicker: {
		backgroundColor: '#3A3A3C',
		color: '#FFFFFF',
		borderWidth: 0,
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		fontFamily: 'sans-serif',
		marginBottom: 12,
		width: '100%',
		boxSizing: 'border-box'
	} as any,
	tagWrapper: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		marginBottom: 12
	},
	tag: {
		backgroundColor: '#48484A',
		borderRadius: 6,
		paddingVertical: 6,
		paddingHorizontal: 12
	},
	tagSelected: { backgroundColor: '#0A84FF' },
	tagText: { color: '#FFFFFF', fontSize: 13, fontWeight: '500' },
	textArea: { height: 65, textAlignVertical: 'top' },
	extraSpacingTop: { marginTop: 8 },
	typeRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
	typeButton: {
		flex: 1,
		backgroundColor: '#3A3A3C',
		borderRadius: 6,
		padding: 10,
		alignItems: 'center'
	},
	typeButtonActive: { backgroundColor: '#0A84FF' },
	typeButtonText: { color: '#AEAEB2', fontWeight: '600' },
	typeButtonTextActive: { color: '#FFFFFF' },
	button: {
		backgroundColor: '#0A84FF',
		borderRadius: 8,
		padding: 12,
		alignItems: 'center'
	},
	successButton: { backgroundColor: '#34C759' },
	buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
	messageText: {
		color: '#FFD60A',
		fontSize: 14,
		textAlign: 'center',
		marginTop: 12
	},
	emptyText: { color: '#8E8E93', textAlign: 'center', marginTop: 30 },
	tripItem: {
		backgroundColor: '#3A3A3C',
		borderRadius: 8,
		padding: 12,
		marginBottom: 10
	},
	tripHeader: { flexDirection: 'row', justifyContent: 'space-between' },
	driverText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
	dateText: { color: '#AEAEB2', fontSize: 12 },
	noteText: {
		color: '#E5E5EA',
		fontSize: 13,
		fontStyle: 'italic',
		marginTop: 2
	},

	// Suggestion Engine Styling
	suggestionAlertBox: {
		backgroundColor: 'rgba(10, 132, 255, 0.1)',
		borderWidth: 1,
		borderColor: '#0A84FF',
		borderRadius: 8,
		padding: 12,
		marginVertical: 10
	},
	suggestionTitleText: {
		color: '#0A84FF',
		fontWeight: 'bold',
		fontSize: 14,
		marginBottom: 2
	},
	suggestionBodyText: { color: '#E5E5EA', fontSize: 13, marginBottom: 8 },
	bold: { fontWeight: 'bold', color: '#FFFFFF' },
	acceptSuggestionBtn: {
		backgroundColor: '#0A84FF',
		borderRadius: 6,
		paddingVertical: 6,
		paddingHorizontal: 12,
		alignItems: 'center',
		alignSelf: 'flex-start'
	},
	acceptBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' }
});
