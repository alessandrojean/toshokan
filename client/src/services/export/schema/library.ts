import { Field, Message } from 'protobufjs'

export class ToshokanDimension extends Message<ToshokanDimension> {
  @Field.d(1, 'float')
  public width!: number

  @Field.d(2, 'float')
  public height!: number
}

export enum ToshokanStatus {
  UNREAD = 0,
  READ = 1,
  FUTURE = 2,
}

export class ToshokanPrice extends Message<ToshokanPrice> {
  @Field.d(1, 'string')
  public currency!: string

  @Field.d(2, 'float')
  public value!: number
}

export class ToshokanOwner extends Message<ToshokanOwner> {
  @Field.d(1, 'string')
  public name!: string

  @Field.d(2, 'string')
  public pictureUrl!: string
}

export class ToshokanBook extends Message<ToshokanBook> {
  @Field.d(1, 'string')
  public code!: string

  @Field.d(2, 'string')
  public group!: string

  @Field.d(3, 'string')
  public title!: string

  @Field.d(4, 'string', 'repeated')
  public authors!: string[]

  @Field.d(5, 'string')
  public publisher!: string

  @Field.d(6, ToshokanDimension)
  public dimensions!: ToshokanDimension

  @Field.d(7, ToshokanStatus)
  public status!: ToshokanStatus

  @Field.d(8, 'string', 'optional', undefined)
  public readAt!: string | undefined

  @Field.d(9, ToshokanPrice)
  public labelPrice!: ToshokanPrice

  @Field.d(10, ToshokanPrice)
  public paidPrice!: ToshokanPrice

  @Field.d(11, 'string')
  public store!: string

  @Field.d(12, 'string', 'optional', undefined)
  public coverUrl!: string | undefined

  @Field.d(13, 'string', 'optional', undefined)
  public boughtAt!: string | undefined

  @Field.d(14, 'bool')
  public favorite!: boolean

  @Field.d(15, 'string', 'optional', undefined)
  public synopsis!: string | undefined

  @Field.d(16, 'string', 'optional', undefined)
  public notes!: string | undefined

  @Field.d(17, 'string', 'repeated')
  public tags!: string[]

  @Field.d(18, 'string')
  public createdAt!: string

  @Field.d(19, 'string')
  public updatedAt!: string

  @Field.d(20, 'int32', 'optional', undefined)
  public sheetVersion!: number | undefined

  @Field.d(21, ToshokanOwner, 'optional', undefined)
  public owner!: ToshokanOwner | undefined | null
}

export class ToshokanSheet extends Message<ToshokanSheet> {
  @Field.d(1, 'int32')
  public version!: number

  @Field.d(2, 'int32')
  public sheetVersion!: number

  @Field.d(3, 'string', 'repeated')
  public groups!: string[]

  @Field.d(4, 'string', 'repeated')
  public tags!: string[]

  @Field.d(5, 'string', 'repeated')
  public publishers!: string[]

  @Field.d(6, 'string', 'repeated')
  public stores!: string[]

  @Field.d(7, 'string', 'repeated')
  public authors!: string[]

  @Field.d(8, ToshokanBook, 'repeated')
  public library!: ToshokanBook[]

  @Field.d(9, ToshokanOwner, 'optional', undefined)
  public owner!: ToshokanOwner | undefined | null
}
