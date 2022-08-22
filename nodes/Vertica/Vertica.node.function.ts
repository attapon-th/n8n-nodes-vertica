import Vertica from 'vertica';
import { IDataObject } from 'n8n-workflow';

export async function Connect(config: {}): Promise<Vertica.Connection> {
	const client: Vertica.Connection = new Vertica.connect(config);
	return client;
}

export async function Disconnect(client: Vertica.Connection) {
	client.disconnect();
}


export async function Query(client: Vertica.Connection, sql: string): Promise< IDataObject[] >{
	return new Promise((resolve, reject) => {
		client.query(sql, (err , resultset: Vertica.Resultset) =>{
			// console.log(resultset)
			const result: IDataObject[] = [] ;
			resultset.rows.forEach((row) => {
				const d: IDataObject = {};
				resultset.fields.forEach((v: Vertica.fields, k: number) => {
					d[v.name] = row[k];
				});
				result.push(d);
			});
			resolve(result);
		});
	});
}

