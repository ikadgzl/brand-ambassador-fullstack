import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Link } from './link.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true
  })
  transaction_id: string;

  @Column()
  user_id: number;

  @Column()
  code: string;

  @Column()
  ambassador_email: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  zip: string;

  @Column({ default: false })
  complete: boolean;

  @CreateDateColumn()
  created_at: boolean;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  order_items: OrderItem[];

  @ManyToOne(() => Link, (link) => link.orders, {
    createForeignKeyConstraints: false
  })
  @JoinColumn({
    name: 'code',
    referencedColumnName: 'code'
  })
  link: Link;

  get name(): string {
    return `${this.first_name}  ${this.last_name}`;
  }

  get total(): number {
    return this.order_items.reduce((acc, curr) => acc + curr.admin_revenue, 0);
  }

  get ambassador_revenue(): number {
    return this.order_items.reduce(
      (acc, curr) => acc + curr.ambassador_revenue,
      0
    );
  }
}
