function getFormattedDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}, ${month}, ${year}`;
}
export { getFormattedDate };
