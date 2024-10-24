CREATE TABLE IF NOT EXISTS "friends" (
	"user_id_1" uuid,
	"user_id_2" uuid,
	CONSTRAINT "friends_user_id_1_user_id_2_pk" PRIMARY KEY("user_id_1","user_id_2"),
	CONSTRAINT "id_order_check" CHECK ("friends"."user_id_1" < "friends"."user_id_2")
);
