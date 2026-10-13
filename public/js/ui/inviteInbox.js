import { useStore, shallowEqual, store } from '../store.js';
import { net } from '../net.js';
import { Button, DifficultyTag, html } from './components.js';
import { toastError } from './toasts.js';
import { t } from '../../../shared/i18n.js';

/** Side inbox for room invitations received while online. */
export function InviteInbox() {
  const invitations = useStore((s) => s.ui.invitations, shallowEqual);
  if (!invitations?.length) return null;
  const respond = async (invite, response) => {
    try {
      await net.request('room.inviteRespond', { inviteId: invite.inviteId, response });
      store.patch('ui', { invitations: store.get().ui.invitations.filter((x) => x.inviteId !== invite.inviteId) });
    } catch (err) { toastError(err); }
  };
  return html`<aside class="invite-inbox" aria-label=${t('同盟邀请')}>
    ${invitations.map((invite) => html`<section class="invite-inbox__card brackets" key=${invite.inviteId}>
      <header><b>${t('同盟邀请')}</b><span class="t-lo">${invite.fromName || t('博士')}</span></header>
      <p>${t('{name}邀请你加入同盟', { name: invite.fromName || t('博士') })}</p>
      <div class="invite-inbox__meta"><span>${t('房间真人：{count}人', { count: invite.humans })}</span><${DifficultyTag} difficulty=${invite.difficulty} size="sm" /></div>
      <div class="invite-inbox__actions">
        <${Button} variant="primary" size="sm" onClick=${() => respond(invite, 'accept')}>${t('接受')}<//>
        <${Button} variant="secondary" size="sm" onClick=${() => respond(invite, 'decline')}>${t('拒绝')}<//>
        <${Button} variant="ghost" size="sm" onClick=${() => respond(invite, 'ignore')}>${t('忽略')}<//>
      </div>
    </section>`)}
  </aside>`;
}
