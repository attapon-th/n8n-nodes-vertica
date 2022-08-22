import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class VerticaApi implements ICredentialType {
	name = 'verticaApi';
	displayName = 'Vertica API';
	documentationUrl = 'https://github.com/attapon-th/n8n-nodes-vertica';
	properties: INodeProperties[] = [
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: 'localhost',
		},
		{
			displayName: 'Database',
			name: 'database',
			type: 'string',
			default: 'VMart',
		},
		{
			displayName: 'User',
			name: 'user',
			type: 'string',
			default: 'dbadmin',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'SSL',
			name: 'ssl',
			type: 'options',
			options: [
				{
					name: 'Optional',
					value: 'optional',
				},
				{
					name: 'Require',
					value: 'require',
				},
				{
					name: 'Verify',
					value: 'verified',
				},
			],
			default: 'optional',
		},
		{
			displayName: 'Port',
			name: 'port',
			type: 'number',
			default: 5433,
		},
		{
			displayName: 'Time Zone',
			name: 'timezone',
			type: 'string',
			default: 'Asia/Bangkok',
			description: "Runs a SET TIMEZONE TO query to set the connection's time zone after connecting.",
		},
	];
}
