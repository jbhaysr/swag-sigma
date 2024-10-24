DO $$ BEGIN
 ALTER TABLE "friends" ADD CONSTRAINT "friends_user_id_1_users_id_fk" FOREIGN KEY ("user_id_1") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friends" ADD CONSTRAINT "friends_user_id_2_users_id_fk" FOREIGN KEY ("user_id_2") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
