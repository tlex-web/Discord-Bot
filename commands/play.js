const { YTSearcher } = require('ytsearcher');
require('dotenv').config();

const { youtubePlayer } = require('../helpers/helpers');

module.exports = {
	name: 'play',
	description: 'Youtube player',
	async execute(message, args) {
		const voiceChannel = message.member.voice.channel;
		const searcher = new YTSearcher(process.env.YOUTUBE_API);
		const query = args.join(' ');
		const url =
			/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
		const yturl =
			/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
		let result;

		if (!voiceChannel)
			return message.channel.send('You need to be in a voice channel!');

		const permissions = voiceChannel.permissionsFor(message.client.user);

		if (!permissions.has('CONNECT'))
			return message.channel.send('You do not have connect permissions!');
		if (!permissions.has('SPEAK'))
			return message.channel.send('You do not have speak permissions!');

		if (!query)
			return message.channel.send('No url or search query provided!');

		if (voiceChannel && url.test(query) && yturl.test(query)) {
			youtubePlayer(voiceChannel, message, query);
		}

		if (voiceChannel && !url.test(query) && !yturl.test(query)) {
			try {
				result = await searcher.search(query);

				if (voiceChannel && result) {
					youtubePlayer(voiceChannel, message, result.first.url);
				}
			} catch (err) {
				message.channel.send(
					'I could not find a video with this search query 😢'
				);
			}
		}

		if (voiceChannel && url.test(query) && !yturl.test(query)) {
			message.channel.send('This is not a valid YouTube URL 🤔');
		}
	},
};
