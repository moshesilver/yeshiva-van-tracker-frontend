const API_URL = 'http://localhost:5000/api';

export interface DriverMetrics {
	id: string;
	name: string;
	_count: {
		trips: number;
		expenses: number;
	};
}

export const api = {
	checkHealth: async () => {
		try {
			const response = await fetch(`${API_URL}/health`);
			return await response.json();
		} catch (error) {
			console.error('Backend communication failed:', error);
			return { status: 'Offline' };
		}
	},

	// Fetch clean list of unique drivers and their aggregate metrics
	getDrivers: async (): Promise<DriverMetrics[]> => {
		try {
			const response = await fetch(`${API_URL}/drivers`);
			return await response.json();
		} catch (error) {
			console.error('Failed to fetch drivers:', error);
			return [];
		}
	},

	createTrip: async (
		driverName: string,
		notes: string,
		startDateTime: string
	) => {
		const response = await fetch(`${API_URL}/trips`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ driverName, notes, startDateTime })
		});
		return response.json();
	},

	getTrips: async () => {
		try {
			const response = await fetch(`${API_URL}/trips`);
			return await response.json();
		} catch (error) {
			console.error('Failed to fetch trips:', error);
			return [];
		}
	},

	matchDriverByTime: async (isoString: string) => {
		try {
			const response = await fetch(
				`${API_URL}/expenses/match-driver?timestamp=${encodeURIComponent(isoString)}`
			);
			const data = await response.json();
			return data.matchingTrip; // Returns trip object containing nested .driver structure or null
		} catch (error) {
			console.error('Driver lookup failed:', error);
			return null;
		}
	},

	// Log Expense payload tracking direct manual values and confirmations
	createExpense: async (expenseData: {
		type: string;
		amount: string;
		dateTime: string;
		status: string;
		notes: string;
		tripId: string | null;
		manualDriverName?: string;
		confirmSuggestedDriver?: boolean;
	}) => {
		const response = await fetch(`${API_URL}/expenses`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(expenseData)
		});
		return response.json();
	},

	// Fetch items parked inside our safety unassigned triage account
	getUnassignedExpenses: async () => {
		try {
			const response = await fetch(`${API_URL}/expenses/unassigned`);
			return await response.json(); // Returns { count: number, expenses: [...] }
		} catch (error) {
			console.error('Failed to pull unassigned triage grid:', error);
			return { count: 0, expenses: [] };
		}
	}
};
