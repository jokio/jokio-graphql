import { request } from 'http';
import axios from 'axios';


export class RestAPI {

	constructor(
		private baseUrl,
		private httpHeaders = {},
		private responseType = 'json',
		private timeout = 10 * 1000
	) { }


	async get<T>(url: string, params?: { [key: string]: any }): Promise<T> {
		const result = await this.httpInstance().get(url, { params });
		return result.data;
	}

	async post<T>(url: string, body?: { [key: string]: any }, params?: { [key: string]: any }): Promise<T> {
		const result = await this.httpInstance().post(url, body, { params });
		return result.data;
	}

	async put<T>(url: string, body?: { [key: string]: any }, params?: { [key: string]: any }): Promise<T> {
		const result = await this.httpInstance().put(url, body, { params });
		return result.data;
	}

	async patch<T>(url: string, body?: { [key: string]: any }, params?: { [key: string]: any }): Promise<T> {
		const result = await this.httpInstance().patch(url, body, { params });
		return result.data;
	}

	async delete<T>(url: string, params?: { [key: string]: any }): Promise<T> {
		const result = await this.httpInstance().delete(url, { params });
		return result.data;
	}


	private httpInstance() {
		return axios.create({
			baseURL: this.baseUrl,
			timeout: this.timeout,
			headers: this.httpHeaders,
			responseType: this.responseType,
		});
	}
}
