import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';
import { Customer } from '../models/customer.model';

dotenv.config();

@Injectable()
export class VtexService {
  private readonly sourceURL = 'https://whirlpoolgtm.vtexcommercestable.com.br/api/dataentities/CL/search';
  private readonly targetURL = 'https://whirlpoolgtml.vtexcommercestable.com.br/api/dataentities/CL/documents';

  private readonly sourceHeaders = {
    'Content-Type': 'application/json',
    'VtexIdclientAutCookie': process.env.VTEX_AUTH_TOKEN_SOURCE,
  };

  private readonly targetHeaders = {
    'Content-Type': 'application/json',
    'VtexIdclientAutCookie': process.env.VTEX_AUTH_TOKEN_TARGET,
  };

  // Obtener un solo cliente de la cuenta WhirlpoolGTM
  async getSingleCustomer(): Promise<Customer | null> {
    try {
      console.log('📡 Solicitando un cliente de WhirlpoolGTM...');
      const response: AxiosResponse<Customer[]> = await axios.get(
        `${this.sourceURL}?_page=1&_pageSize=1`,
        { headers: this.sourceHeaders }
      );

      if (response.data.length === 0) {
        console.warn('⚠️ No se encontraron clientes en la fuente.');
        return null;
      }
      
      console.log('✅ Cliente obtenido:', response.data[0]);
      return response.data[0];
    } catch (error) {
      console.error('❌ Error al obtener cliente de VTEX:', error.response?.data || error.message);
      return null;
    }
  }

  // Guardar el cliente en la cuenta WhirlpoolGTML en la entidad Mastercard CL
  async saveCustomerToMastercardCL(customer: Customer): Promise<boolean> {
    try {
      console.log('📡 Enviando cliente a Mastercard CL...');
      const response = await axios.post(this.targetURL, customer, {
        headers: this.targetHeaders,
      });
      console.log('✅ Cliente guardado en Mastercard CL:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Error al guardar cliente en Mastercard CL:', error.response?.data || error.message);
      return false;
    }
  }

  // Función principal que obtiene y guarda el cliente
  async transferCustomer(): Promise<{ message: string }> {
    const customer = await this.getSingleCustomer();
    if (!customer) {
      return { message: '⚠️ No se encontró ningún cliente en VTEX.' };
    }

    const success = await this.saveCustomerToMastercardCL(customer);
    return success
      ? { message: '✅ Cliente transferido correctamente.' }
      : { message: '❌ Error al transferir el cliente.' };
  }
}

import { Controller, Get } from '@nestjs/common';
import { VtexService } from '../services/vtex.service';

@Controller('vtex')
export class VtexController {
  constructor(private readonly vtexService: VtexService) {}

  @Get('transfer-customer')
  async transferCustomer(): Promise<{ message: string }> {
    console.log('📡 Iniciando transferencia de cliente...');
    return this.vtexService.transferCustomer();
  }
}
