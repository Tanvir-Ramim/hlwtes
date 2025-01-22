const { differenceInDays } = require("date-fns");
const { Leave_notice_period } = require("../model/leave/leaveApplyModel");
const { User } = require("../model/user/userModel");
const leaveValidate = async (req, res, next) => {
  const { leave_type, applied_on, start_date, total_days, employee_id } =
    req.body;

  try {
    //### user leave balance check ####

    const ifBalance = await User.findOne({
      employee_id,
      leave_balance: { $gte: total_days }, // Ensure they have enough leave balance
    });

    if (!ifBalance) {
      return res.status(400).json({
        message: `You are not eligible to apply for ${leave_type} (${total_days} ${
          total_days > 1 ? "days" : "day"
        }) request, as you do not have enough leave balance.`,
      });
    }
    res.leave_blance = ifBalance.leave_balance;
    //### rule leave  check ####

    const leaveNotices = await Leave_notice_period.find({
      leave_type,
    });

    if (!leaveNotices || leaveNotices.length === 0) {
      // return res.status(400).json({ message: "Invalid leave type" });
      return res.status(400).json({ message: "Type Notice Not Found" });
    }

    //### sort if same type has different leave duration period ###
    const sortedNotices = leaveNotices.sort((a, b) => a.duration - b.duration);

    //### leave period equal check ####
    let leaveNotice;
    leaveNotice = sortedNotices.find(
      (notice) => parseInt(total_days) === notice.duration
    );

    const mx = sortedNotices.pop();


    if (!leaveNotice && mx.duration < total_days) {
      leaveNotice = mx;
    } else if (!leaveNotice && mx.duration > total_days) {
      leaveNotice = mx;
    } else {
      leaveNotice = leaveNotice;
    }

    if (!leaveNotice) {
      return res
        .status(400)
        .json({ message: "No matching leave notice period found" });
    }

    //### sick leave attachment  check ####

    if (leaveNotice.isFile && !req.file) {
      return res.status(400).json({
        message: `You need to upload  Doctor's Prescription`,
      });
    }

    const noticePeriod = differenceInDays(
      new Date(start_date),
      new Date(applied_on)
    );

    // const { differenceInDays } = require("date-fns");
    if (leaveNotice.notice_period_days === 0) {
      res.role = leaveNotice;
      return next();
    }

    if (noticePeriod < leaveNotice.notice_period_days) {
      return res.status(400).json({
        message: `You need to apply at least ${leaveNotice.notice_period_days} days before the start date. Current notice period is ${noticePeriod} days.`,
      });
    }

    res.role = leaveNotice;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { leaveValidate };
