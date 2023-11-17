import { Column, Entity } from "typeorm"
import { AbstractEntity } from "src/database/abstract.entity"

@Entity()
export class Comment extends AbstractEntity<Comment> {
  @Column()
  content: string
}
