// Helper function to determine if an item is a folder
const isFolder = (item) => {
    // Implement your logic to determine if the item is a folder
    // For example, you might check for a specific property or file extension
    return item.children !== undefined;
};
// Helper function to extract leading numeric characters as a number
const getLeadingNumber = (label) => {
    const match = label.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : null;
};
// Custom comparator function
const compareLabels = (a, b) => {
    const aNumber = getLeadingNumber(a);
    const bNumber = getLeadingNumber(b);
    if (aNumber !== null && bNumber !== null) {
        if (aNumber !== bNumber) {
            return aNumber - bNumber;
        }
        // If leading numbers are equal, compare the rest of the string
        const aRest = a.substring(aNumber.toString().length);
        const bRest = b.substring(bNumber.toString().length);
        return aRest.toLowerCase().localeCompare(bRest.toLowerCase());
    }
    if (aNumber !== null) {
        return -1; // Items starting with numbers come first
    }
    if (bNumber !== null) {
        return 1; // Items starting with numbers come first
    }
    // Fallback to case-insensitive alphabetical comparison
    return a.toLowerCase().localeCompare(b.toLowerCase());
};
const sortFileDirectoryArr = (arr) => {
    // Create a copy of the array to avoid mutating the original
    const sortedArr = [...arr];
    // Sort the array
    sortedArr.sort((a, b) => {
        const aIsFolder = isFolder(a);
        const bIsFolder = isFolder(b);
        if (aIsFolder && !bIsFolder) {
            return -1; // Folders come before files
        }
        if (!aIsFolder && bIsFolder) {
            return 1; // Folders come before files
        }
        // If both are folders or both are files, sort based on labels
        return compareLabels(a.label, b.label);
    });
    // Recursively sort the children
    sortedArr.forEach((item) => {
        if (item.children && item.children.length > 0) {
            item.children = sortFileDirectoryArr(item.children);
        }
    });
    return sortedArr;
};
export default sortFileDirectoryArr;
