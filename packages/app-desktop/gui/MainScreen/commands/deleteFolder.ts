import { CommandRuntime, CommandDeclaration, CommandContext } from '@joplin/lib/services/CommandService';
import { _ } from '@joplin/lib/locale';
import bridge from '../../../services/bridge';
import Folder from '@joplin/lib/models/Folder';
const { substrWithEllipsis } = require('@joplin/lib/string-utils');

export const declaration: CommandDeclaration = {
	name: 'deleteFolder',
	label: () => _('Delete notebook'),
};

export const runtime = (): CommandRuntime => {
	return {
		execute: async (context: CommandContext, folderId: string = null) => {
			if (folderId === null) folderId = context.state.selectedFolderId;

			const folder = await Folder.load(folderId);
			if (!folder) throw new Error(`No such folder: ${folderId}`);

			const ok = bridge().showConfirmMessageBox(_('Delete notebook "%s"?\n\nAll notes and sub-notebooks within this notebook will also be deleted.', substrWithEllipsis(folder.title, 0, 32)), {
				buttons: [_('Delete'), _('Cancel')],
				defaultId: 1,
			});
			if (!ok) return;

			await Folder.delete(folderId);
		},
		enabledCondition: '!folderIsReadOnly',
	};
};