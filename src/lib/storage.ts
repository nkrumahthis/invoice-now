function get(key: string) {
	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : null;
	} catch (error) {
		console.error("Error accessing localStorage:", error);
		return null;
	}
}

function set(key: string, value: any) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.error("Error saving to localStorage:", error);
	}
}

function remove(key: string) {
	localStorage.removeItem(key);
}

export const storage = {
	get,
	set,
	remove,
};
