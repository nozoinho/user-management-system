function formatToMonthDayYear(date) {
  if (!date) return '';
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const d = new Date(date);
  const day = d.getUTCDate();       
  const month = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  
  return `${month} ${day}, ${year}`;
}

module.exports = { formatToMonthDayYear };