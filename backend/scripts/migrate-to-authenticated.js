// One-off migration: moves existing 'upload' (public) video resources to the
// 'authenticated' delivery type so playback URLs can be signed and expired.
//
// Run this yourself, locally, with your real CLOUDINARY_URL in backend/.env —
// it is not run automatically and no credentials are read from this repo.
//
// Usage:
//   node backend/scripts/migrate-to-authenticated.js            # dry run, lists what would change
//   node backend/scripts/migrate-to-authenticated.js --apply    # actually renames the assets
//
// After this completes successfully, flip VIDEO_DELIVERY_TYPE in
// backend/src/services/video.service.js from 'upload' to 'authenticated' and
// deploy. Doing it in the other order will 404 every video until this has run.

import 'dotenv/config';
import { cloudinary, isCloudinaryConfigured } from '../src/config/cloudinary.js';

const apply = process.argv.includes('--apply');

if (!isCloudinaryConfigured) {
  console.error('CLOUDINARY_URL is not set. Aborting.');
  process.exit(1);
}

async function listAllUploadVideos() {
  const resources = [];
  let cursor;
  do {
    const result = await cloudinary.api.resources({
      resource_type: 'video',
      type: 'upload',
      max_results: 500,
      next_cursor: cursor,
    });
    resources.push(...result.resources);
    cursor = result.next_cursor;
  } while (cursor);
  return resources;
}

async function main() {
  const resources = await listAllUploadVideos();
  console.log(`Found ${resources.length} video resource(s) with type 'upload'.`);

  if (!apply) {
    resources.forEach((r) => console.log(`  [dry run] would migrate: ${r.public_id}`));
    console.log('\nRe-run with --apply to perform the migration.');
    return;
  }

  for (const resource of resources) {
    try {
      await cloudinary.uploader.rename(resource.public_id, resource.public_id, {
        resource_type: 'video',
        type: 'upload',
        to_type: 'authenticated',
        overwrite: true,
      });
      console.log(`  migrated: ${resource.public_id}`);
    } catch (error) {
      console.error(`  FAILED: ${resource.public_id} — ${error.message}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
