import { Controller, Get, Post } from '@nestjs/common';
import { VtexService } from '../services/vtex.service';
import { Customer } from '../models/customer.model';

@Controller('vtex')
export class VtexController {
  constructor(private readonly vtexService: VtexService) {}

  @Get('customer')
  async fetchSingleCustomer(): Promise<Customer | { message: string; error?: string }> {
    try {
      const customer = await this.vtexService.getSingleCustomer();
      if (!customer) {
        return { message: '⚠️ No se encontró ningún cliente en VTEX.' };
      }
      return customer;
    } catch (error) {
      console.error('❌ Error al obtener el cliente de VTEX:', error);
      return { message: '❌ Error al obtener el cliente de VTEX.', error: error.message };
    }
  }

  @Post('customer/mastercard')
  async fetchAndSaveCustomer(): Promise<{ message: string; error?: string }> {
    try {
      const customer = await this.vtexService.getSingleCustomer();
      if (!customer) {
        return { message: '⚠️ No se encontró ningún cliente para guardar.' };
      }

      await this.vtexService.saveCustomerToMastercard(customer);
      return { message: '✅ Cliente guardado exitosamente en Mastercard CL.' };
    } catch (error) {
      console.error('❌ Error al guardar el cliente en Mastercard CL:', error);
      return { message: '❌ No se pudo guardar el cliente en Mastercard CL.', error: error.message };
    }
  }
}
