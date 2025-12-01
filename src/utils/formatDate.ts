import moment from "moment";

export const formatDate = (_date: string, _format = "DD/MM/YYYY hh:mm A") => {
    if (_format === "fromNow") {
      const after12Hrs = moment(_date).add(12, "hours");
      if (moment().isAfter(after12Hrs)) {
        _format = "DD/MM/YYYY hh:mm A";
      } else {
        _format = "hh:mm A";
      }
    }
    return moment(new Date(_date)).format(_format);
}