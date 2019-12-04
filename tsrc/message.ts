let Message = function(command, data) {
	if(!command || !data) throw new Error('Invalid Arguments');
	this.command = command;
	this.data = data;
}

export default {
	createMessage: function(obj) {
		const command = obj.command;
		const data = obj.data;

		return new Message(command, data);
	}
}