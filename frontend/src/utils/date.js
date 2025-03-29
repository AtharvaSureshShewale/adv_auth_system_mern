export const formatDate = (dateString) => {
    if (!dateString) return "No Date Provided"; // Handle empty values

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }

    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZoneName: "short",
    });
};
