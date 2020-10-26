import { authFlags } from './auth';
import { helpFlags } from './help';
import { versionFlags } from './version';
import { dotFlags } from './dot';

export const commonFlags = {
  ...helpFlags,
  ...authFlags,
  ...versionFlags,
  ...dotFlags,
};
