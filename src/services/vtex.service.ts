import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';
import { Customer } from '../models/customer.model';

dotenv.config();

@Injectable()
export class VtexService {
  private readonly baseURL = 'https://whirlpoolgtm.vtexcommercestable.com.br/api/dataentities/CL';
  
  private readonly getHeaders = {
    'Content-Type': 'application/json',
    'VtexIdclientAutCookie': process.env.VTEX_GET_AUTH_TOKEN, // 🔑 Key para obtener datos
  };

  private readonly saveHeaders = {
    'Content-Type': 'application/json',
    'VtexIdclientAutCookie': process.env.VTEX_SAVE_AUTH_TOKEN, // 🔑 Key para guardar datos
  };

  /**
   * Obtiene un solo cliente desde VTEX
   */
  async getSingleCustomer(): Promise<Customer | null> {
    try {
      console.log('📥 Obteniendo un cliente de VTEX...');
      const response: AxiosResponse<Customer[]> = await axios.get(
        `${this.baseURL}/search?_page=1&_pageSize=1`,
        { headers: this.getHeaders }
      );

      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error('❌ Error al obtener cliente:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Guarda un cliente en VTEX usando la clave de guardado
   */
  async saveCustomerToMastercard(customer: Customer): Promise<void> {
    try {
      const saveURL = 'https://whirlpoolgtml.vtexcommercestable.com.br/api/dataentities/CL/documents';
  
      // 🔑 Clave de API para GUARDAR en Mastercard CL
      const headers = {
        'Content-Type': 'application/json',
        'VtexIdclientAutCookie': process.env.VTEX_MASTERCARD_AUTH_TOKEN, // Nueva API Key
      };
  
      const response = await axios.post(saveURL, customer, { headers });
  
      console.log('✅ Cliente guardado en Mastercard CL:', response.data);
    } catch (error) {
      console.error('❌ Error al guardar cliente en Mastercard CL:', error.response?.data || error.message);
      throw error;
    }
  }
}  