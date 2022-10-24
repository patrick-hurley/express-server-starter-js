module.exports = {
    convertToUnix: function (date) {
        if (date.getTime() && typeof date.getTime === 'function') {
            return Math.floor(date.getTime() / 1000)
        } else {
            throw new Error('Property is not a Date object')
        }
    },
    addDays: function (date, days) {
        var result = new Date(date)
        result.setDate(result.getDate() + days)
        return Math.floor(result / 1000)
    },
    getDateString: function (currency) {
        let countryCode = 'en-GB'
        let timeZone = 'Europe/London'
        if (currency === 'eur') {
            countryCode = 'en-GB'
            timeZone = 'Europe/Madrid'
        } else if (currency === 'usd') {
            countryCode = 'en-US'
            timeZone = 'America/Los_Angeles'
        }

        const dateNow = new Date()
        const dateString =
            dateNow.toLocaleDateString(countryCode, {
                timeZone,
            }) +
            ' - ' +
            dateNow.toLocaleTimeString(countryCode, {
                timeZone,
            })
        return dateString
    },
    // Accepts unix
    daysRemainingUntil: function (date) {
        const now = Math.floor(Date.now() / 1000)
        const difference = date - now
        return difference > 0 ? Math.ceil(difference / (3600 * 24)) : 0
    },
}
