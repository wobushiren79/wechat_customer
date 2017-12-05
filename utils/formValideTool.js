var toastUtil = require('ToastUtil.js');
/**
 * 验证项装载
 * 参数：name string 必填项名称
 * 	msg string 提示消息内容
 */
function formValideWireObj(name, msg) {
	var obj = {};
	obj.name = name;
	obj.msg = msg;
	return obj;
}
/**
 * 验证项初判定
 * 参数：formDataObj object 提交对象
 * 	requireFormData array 需判定项formValideWireObj数组
 */
function formValideRequireData(formDataObj, requireFormData) {
	if (formDataObj == null || requireFormData == null ||
		requireFormData.length == null || requireFormData.length == 0) {
		return false;
	}
	var isFill = true;
	var msg = null;
	for (var i in requireFormData) {
		var item = requireFormData[i];
		var itemVal = formDataObj[item.name];
		if (itemVal == null || (typeof (itemVal) == 'string' && itemVal.length == 0)) {
			isFill = false;
			msg = item.msg;
			break;
		}
	}
	if (!isFill) {
		toastUtil.showToastReWrite(msg, 'icon_info');
		return false;
	}
	return true;
}
module.exports.formValideWireObj = formValideWireObj;
module.exports.formValideRequireData = formValideRequireData;