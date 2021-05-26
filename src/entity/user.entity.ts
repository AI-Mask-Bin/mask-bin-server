import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('User')
export class UserEntity {
  @PrimaryColumn({
    type: 'int',
    nullable: false,
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'int',
    default: 0,
  })
  maskPoint: number;

  @Column({
    type: 'int',
    default: 0,
  })
  coupon: number;

  @Column({
    type: 'int',
    default: 0,
  })
  usedCoupon: number;
}
