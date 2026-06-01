import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	StyleSheet
} from 'react-native';
import { styles } from './DriverSelectDropdown.styles';

interface DriverSelectDropdownProps {
	value: string;
	onChangeText: (text: string) => void;
	suggestions: Array<{ id: string; name: string }>;
	placeholder: string;
}

export default function DriverSelectDropdown({
	value,
	onChangeText,
	suggestions,
	placeholder
}: DriverSelectDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);

	// Filter out the fallback system account and match user input text
	const filtered = suggestions.filter(
		d =>
			d.name !== 'Unassigned Fleet Driver' &&
			d.name.toLowerCase().includes(value.toLowerCase())
	);

	const handleSelect = (name: string) => {
		onChangeText(name);
		setIsOpen(false);
	};

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder={placeholder}
				placeholderTextColor="#8E8E93"
				value={value}
				onChangeText={text => {
					onChangeText(text);
					setIsOpen(true);
				}}
				onFocus={() => setIsOpen(true)}
				onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Small delay allowing touch events to register before close
			/>

			{isOpen && (value.length > 0 || filtered.length > 0) && (
				<View style={styles.dropdownOverlay}>
					<ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
						{/* Top default Option: Explicitly type/create what is currently entered */}
						{value.trim().length > 0 &&
							!filtered.some(
								f => f.name.toLowerCase() === value.trim().toLowerCase()
							) && (
								<TouchableOpacity
									style={[styles.row, styles.createRow]}
									onPress={() => handleSelect(value.trim())}
								>
									<Text style={styles.createText}>
										➕ Create "{value.trim()}"
									</Text>
								</TouchableOpacity>
							)}

						{/* Filtered suggestions matching typography variables */}
						{filtered.map(driver => (
							<TouchableOpacity
								key={driver.id}
								style={styles.row}
								onPress={() => handleSelect(driver.name)}
							>
								<Text style={styles.rowText}>{driver.name}</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>
			)}
		</View>
	);
}
