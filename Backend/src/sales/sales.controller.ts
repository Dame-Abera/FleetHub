import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Query 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

@ApiTags('sales')
@Controller('sales')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sale transaction' })
  create(@Body() createSaleDto: CreateSaleDto, @GetUser() user: User) {
    return this.salesService.create(createSaleDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sale transactions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'carId', required: false, type: String })
  findAll(
    @GetUser() user: User,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('carId') carId?: string
  ) {
    return this.salesService.findAll(user, { page, limit, carId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sale transaction by ID' })
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.salesService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a sale transaction' })
  update(
    @Param('id') id: string, 
    @Body() updateSaleDto: UpdateSaleDto, 
    @GetUser() user: User
  ) {
    return this.salesService.update(id, updateSaleDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sale transaction' })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.salesService.remove(id, user);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm a sale transaction' })
  confirmSale(@Param('id') id: string, @GetUser() user: User) {
    return this.salesService.confirmSale(id, user);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject a sale transaction' })
  rejectSale(
    @Param('id') id: string, 
    @GetUser() user: User,
    @Body() body?: { reason?: string }
  ) {
    return this.salesService.rejectSale(id, user, body?.reason);
  }
}
