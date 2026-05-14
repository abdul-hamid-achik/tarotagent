CREATE TABLE "accountLoginCodes" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"email" text NOT NULL,
	"codeHash" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"consumedAt" timestamp with time zone,
	CONSTRAINT "accountLoginCodes_codeHash_unique" UNIQUE("codeHash")
);
--> statement-breakpoint
ALTER TABLE "accountLoginCodes" ADD CONSTRAINT "accountLoginCodes_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accountLoginCodes_email_idx" ON "accountLoginCodes" USING btree ("email");