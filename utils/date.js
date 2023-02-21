module.exports = {
    getDueDate: (countDay) => {
        const now = Date.now()
        const dateNow = new Date(now)
        let year = dateNow.getFullYear()
        let month = dateNow.getMonth() + 1
        let day = dateNow.getDate() + countDay
        let hour = dateNow.getHours()
        let minute = dateNow.getMinutes()
        let second = dateNow.getSeconds()
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    },
    getDateNow: () => {
        const now = Date.now()
        const dateNow = new Date(now)
        let year = dateNow.getFullYear()
        let month = dateNow.getMonth() + 1
        let day = dateNow.getDate()
        let hour = dateNow.getHours()
        let minute = dateNow.getMinutes()
        let second = dateNow.getSeconds()
        hour = parseInt(hour) < 10 ? '0' + hour : hour
        minute = parseInt(minute) < 10 ? '0' + minute : minute
        second = parseInt(second) < 10 ? '0' + second : second
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    },
    convertDate: (date) => {
        const dateConvert = new Date(date)
        let year = dateConvert.getFullYear()
        let month = dateConvert.getMonth() + 1
        let day = dateConvert.getDate()
        day = parseInt(day) < 10 ? '0' + day : day
        month = parseInt(month) < 10 ? '0' + month : month
        return `${year}-${month}-${day}`
    },
    convertDateYMD: date => {
        const dateConvert = new Date(date)
        let year = dateConvert.getFullYear()
        let month = dateConvert.getMonth() + 1
        let day = dateConvert.getDate()
        let hour = dateConvert.getHours()
        let minute = dateConvert.getMinutes()
        let second = dateConvert.getSeconds()
        day = parseInt(day) < 10 ? '0' + day : day
        month = parseInt(month) < 10 ? '0' + month : month
        hour = parseInt(hour) < 10 ? '0' + hour : hour
        minute = parseInt(minute) < 10 ? '0' + minute : minute
        second = parseInt(second) < 10 ? '0' + second : second
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    }
}