import { IExecuteFunctions } from 'n8n-core';
import {
		IDataObject,
		INodeExecutionData,
		INodeType,
		INodeTypeDescription,
		JsonObject,
		NodeOperationError
} from 'n8n-workflow';

import {Connect , Disconnect, Query} from './Vertica.node.function';



export class Vertica implements INodeType {
		description: INodeTypeDescription = {
				displayName: 'Vertica',
				name: 'vertica',
				icon: 'file:vertica.svg',
				group: ['input'],
				version: 1,
				description: 'Get, add and update data in Vertica',
				defaults: {
						name: 'Vertica',
				},
				inputs: ['main'],
				outputs: ['main'],
				credentials: [
						{
								name: 'verticaApi',
								required: true,
						},
				],
				properties: [
						{
								displayName: 'Operation',
								name: 'operation',
								type: 'options',
								noDataExpression: true,
								options: [
										{
												name: 'Execute Query',
												value: 'executeQuery',
												description: 'Execute an SQL query',
												action: 'Execute a SQL query',
										},
								],
								default: 'executeQuery',
						},

						// ----------------------------------
						//         executeQuery
						// ----------------------------------
						{
								displayName: 'Query',
								name: 'query',
								type: 'string',
								typeOptions: {
										alwaysOpenEditWindow: true,
								},
								displayOptions: {
										show: {
												operation: ['executeQuery'],
										},
								},
								default: '',
								placeholder: 'SELECT id, name FROM product WHERE quantity > 1 AND price <= 2.0',
								required: true,
						},
				],
		};

		async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
				const credentials = await this.getCredentials('verticaApi');
				const config: {} = {
						host: credentials.host as string,
						port: credentials.port as number,
						database: credentials.database as string,
						user: credentials.user as string,
						password: credentials.password as string,
						ssl: credentials.ssl,
				};


				const db = await Connect(config);
				let returnItems: INodeExecutionData[] = [];
				const items = this.getInputData();
				const operation = this.getNodeParameter('operation', 0) as string;

				if (operation === 'executeQuery') {
						const allQueries = [] as Array<{ query: string }>;
						for (let i = 0; i < items.length; i++) {
								const query = this.getNodeParameter('query', i) as string;
								// const values = valuesArray[i];
								const queryFormat = { query };
								allQueries.push(queryFormat);
						}
						const result: IDataObject[] = [] ;
						for (let i = 0; i < allQueries.length; i++) {
								try {
										const res = await Query(db, allQueries[i].query);
										Array.prototype.push.apply(
											result,
											res,
										);
								} catch (err) {
										if (this.continueOnFail() === false) throw err;
										result.push({
												...items[i].json,
												code: (err as JsonObject).code,
												message: (err as JsonObject).message,
										});
								}
						}
						returnItems = this.helpers.returnJsonArray(result);
				} else {
					await Disconnect(db);
						throw new NodeOperationError(
								this.getNode(),
								`The operation "${operation}" is not supported!`,
						);
				}
				await Disconnect(db);

				return this.prepareOutputData(returnItems);
		}
}
