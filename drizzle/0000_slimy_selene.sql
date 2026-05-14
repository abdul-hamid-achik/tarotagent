CREATE TABLE "emailDeliveries" (
	"id" text PRIMARY KEY NOT NULL,
	"readingId" text NOT NULL,
	"sessionId" text NOT NULL,
	"email" text NOT NULL,
	"provider" text NOT NULL,
	"providerMessageId" text,
	"status" text NOT NULL,
	"errorMessage" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"sentAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "readingEvents" (
	"id" text PRIMARY KEY NOT NULL,
	"readingId" text,
	"shareSlug" text,
	"sessionId" text NOT NULL,
	"eventType" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "readings" (
	"id" text PRIMARY KEY NOT NULL,
	"shareSlug" text NOT NULL,
	"sessionId" text NOT NULL,
	"userId" text,
	"status" text NOT NULL,
	"question" text NOT NULL,
	"spreadType" text NOT NULL,
	"spreadName" text NOT NULL,
	"spreadDescription" text NOT NULL,
	"cards" jsonb,
	"revealTimingsMs" jsonb,
	"finalText" text,
	"errorMessage" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"completedAt" timestamp with time zone,
	"failedAt" timestamp with time zone,
	CONSTRAINT "readings_shareSlug_unique" UNIQUE("shareSlug")
);
--> statement-breakpoint
ALTER TABLE "emailDeliveries" ADD CONSTRAINT "emailDeliveries_readingId_readings_id_fk" FOREIGN KEY ("readingId") REFERENCES "public"."readings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "readingEvents" ADD CONSTRAINT "readingEvents_readingId_readings_id_fk" FOREIGN KEY ("readingId") REFERENCES "public"."readings"("id") ON DELETE set null ON UPDATE no action;