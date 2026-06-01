import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		position: 'relative',
		zIndex: 999,
		width: '100%'
	},
	input: {
		backgroundColor: '#3A3A3C',
		borderRadius: 8,
		color: '#FFFFFF',
		padding: 12,
		fontSize: 16,
		marginBottom: 10
	},
	dropdownOverlay: {
		position: 'absolute',
		top: 48,
		left: 0,
		right: 0,
		backgroundColor: '#2C2C2E',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#48484A',
		maxHeight: 180,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
		zIndex: 1000
	},
	dropdownScroll: {
		paddingVertical: 4
	},
	row: {
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#3A3A3C'
	},
	createRow: {
		backgroundColor: 'rgba(10, 132, 255, 0.1)'
	},
	createText: {
		color: '#0A84FF',
		fontWeight: '600',
		fontSize: 14
	},
	rowText: {
		color: '#FFFFFF',
		fontSize: 14
	}
});
