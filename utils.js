// Utility function to format a Date object into "Mon DD, YYYY" format
function formatToMonthDayYear(date) {
  if (!date) return ''; // Return empty string if no date is provided

  // Array of month abbreviations
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const d = new Date(date);                 // Convert input to a Date object
  const day = d.getUTCDate();               // Get day of the month (UTC)       
  const month = months[d.getUTCMonth()];    // Get month abbreviation
  const year = d.getUTCFullYear();          // Get full year
  
  return `${month} ${day}, ${year}`; // Return formatted date string
}

// Export the function for use in other modules
module.exports = { formatToMonthDayYear };