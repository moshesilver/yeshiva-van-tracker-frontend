import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	scrollContainer: {
		flexGrow: 1,
		backgroundColor: '#1C1C1E',
		padding: 20
	},
	layoutWrapper: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		gap: 20,
		width: '100%',
		maxWidth: 1100,
		alignSelf: 'center'
	},
	column: {
		flex: 1,
		minWidth: 340,
		maxWidth: 520,
		gap: 20
	},
	card: {
		backgroundColor: '#2C2C2E',
		borderRadius: 12,
		padding: 22
	},
	flexibleHeight: {
		flex: 1
	},
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
	statusText: {
		color: '#AEAEB2',
		fontSize: 13,
		marginBottom: 10
	},
	divider: {
		height: 1,
		backgroundColor: '#3A3A3C',
		marginBottom: 16
	},
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
	tagSelected: {
		backgroundColor: '#0A84FF'
	},
	tagText: {
		color: '#FFFFFF',
		fontSize: 13,
		fontWeight: '500'
	},
	textArea: {
		height: 65,
		textAlignVertical: 'top'
	},
	extraSpacingTop: {
		marginTop: 8
	},
	typeRow: {
		flexDirection: 'row',
		gap: 10,
		marginBottom: 14
	},
	typeButton: {
		flex: 1,
		backgroundColor: '#3A3A3C',
		borderRadius: 6,
		padding: 10,
		alignItems: 'center'
	},
	typeButtonActive: {
		backgroundColor: '#0A84FF'
	},
	typeButtonText: {
		color: '#AEAEB2',
		fontWeight: '600'
	},
	typeButtonTextActive: {
		color: '#FFFFFF'
	},
	button: {
		backgroundColor: '#0A84FF',
		borderRadius: 8,
		padding: 12,
		alignItems: 'center'
	},
	successButton: {
		backgroundColor: '#34C759'
	},
	buttonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: 'bold'
	},
	messageText: {
		color: '#FFD60A',
		fontSize: 14,
		textAlign: 'center',
		marginTop: 12
	},
	emptyText: {
		color: '#8E8E93',
		textAlign: 'center',
		marginTop: 30
	},
	tripItem: {
		backgroundColor: '#3A3A3C',
		borderRadius: 8,
		padding: 12,
		marginBottom: 10
	},
	tripHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	driverText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: 'bold'
	},
	dateText: {
		color: '#AEAEB2',
		fontSize: 12
	},
	noteText: {
		color: '#E5E5EA',
		fontSize: 13,
		fontStyle: 'italic',
		marginTop: 2
	},
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
	suggestionBodyText: {
		color: '#E5E5EA',
		fontSize: 13,
		marginBottom: 8
	},
	bold: {
		fontWeight: 'bold',
		color: '#FFFFFF'
	},
	acceptSuggestionBtn: {
		backgroundColor: '#0A84FF',
		borderRadius: 6,
		paddingVertical: 6,
		paddingHorizontal: 12,
		alignItems: 'center',
		alignSelf: 'flex-start'
	},
	acceptBtnText: {
		color: '#FFFFFF',
		fontSize: 13,
		fontWeight: '600'
	},
	loginContainer: {
		flex: 1,
		backgroundColor: '#1C1C1E',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		width: '100%',
		height: '100%'
	},
	loginCard: {
		backgroundColor: '#2C2C2E',
		borderRadius: 12,
		padding: 30,
		width: '100%',
		maxWidth: 400,
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 15
	},
	loginTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#FFFFFF',
		textAlign: 'center',
		marginBottom: 6
	},
	loginSubtitle: {
		color: '#AEAEB2',
		fontSize: 14,
		textAlign: 'center',
		marginBottom: 16,
		lineHeight: 18
	},
	errorText: {
		color: '#FF453A',
		fontSize: 14,
		fontWeight: '500',
		textAlign: 'center',
		marginTop: 12
	}
});
