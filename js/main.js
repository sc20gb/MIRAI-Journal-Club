function showPage(pageId) {
    const page = document.getElementById(pageId);

    if (!page) {
        return;
    }

    document.querySelectorAll('.page-section').forEach((section) => {
        section.classList.remove('active');
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
        const isActive = link.dataset.page === pageId;
        link.classList.toggle('active', isActive);

        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    page.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const memberSectionConfig = [
    {
        key: 'staff',
        title: 'Staff',
    },
    {
        key: 'phd',
        title: 'PhD Students',
    },
    {
        key: 'masters',
        title: 'Master Students',
    },
];

const contactFields = [
    {
        label: 'Email',
        getValue: (member) => member.email,
        type: 'email',
    },
    {
        label: 'Google Scholar',
        getValue: (member) => member.links?.googleScholar,
        type: 'external',
    },
    {
        label: 'LinkedIn',
        getValue: (member) => member.links?.linkedIn,
        type: 'external',
    },
    {
        label: 'GitHub',
        getValue: (member) => member.links?.github,
        type: 'external',
    },
    {
        label: 'Personal Website',
        getValue: (member) => member.links?.personalWebsite,
        type: 'external',
    },
];

function getText(value, fallback = '') {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function getInitials(name) {
    const parts = getText(name, 'Member').split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function getSinceText(member) {
    return member.since ? `Since ${member.since}` : 'Since ...';
}

function isStaffMember(member) {
    return member.category === 'staff';
}

function getCategoryLabel(category) {
    return memberSectionConfig.find((section) => section.key === category)?.title || 'Member';
}

function getCompactMemberMeta(member) {
    if (isStaffMember(member)) {
        return getText(member.position, 'Staff position');
    }

    return getSinceText(member);
}

function getDialogMemberMeta(member) {
    if (isStaffMember(member)) {
        const meta = [getText(member.position, 'Staff position')];

        if (member.since) {
            meta.push(getSinceText(member));
        }

        return meta;
    }

    return [getSinceText(member)];
}

function createTextElement(tagName, className, text) {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    return element;
}

function createAvatarPlaceholder(member) {
    const placeholder = document.createElement('div');
    placeholder.className = 'avatar-placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.textContent = getInitials(member.name);
    return placeholder;
}

function createMemberAvatar(member, className) {
    const avatar = document.createElement('div');
    avatar.className = className;

    if (member.image) {
        const image = document.createElement('img');
        image.src = member.image;
        image.alt = `${getText(member.name, 'Member')} profile image placeholder`;
        image.loading = 'lazy';
        image.addEventListener('error', () => {
            avatar.replaceChildren(createAvatarPlaceholder(member));
        });
        avatar.append(image);
        return avatar;
    }

    avatar.append(createAvatarPlaceholder(member));
    return avatar;
}

function createMemberCard(member) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = isStaffMember(member) ? 'member-card is-staff' : 'member-card is-student';
    card.setAttribute('aria-label', `Open profile details for ${getText(member.name, 'member')}`);

    const body = document.createElement('div');
    body.className = 'member-card-body';
    body.append(
        createTextElement('h4', 'member-card-name', getText(member.name, 'Member Name')),
        createTextElement('p', 'member-card-meta', getCompactMemberMeta(member))
    );

    card.append(createMemberAvatar(member, 'member-card-avatar'), body);
    card.addEventListener('click', () => openMemberDialog(member));

    return card;
}

function createEmptyState() {
    const emptyState = document.createElement('div');
    emptyState.className = 'member-empty-state';
    emptyState.append(
        createTextElement('p', 'member-empty-title', 'Members will be added soon.'),
        createTextElement('p', 'member-empty-copy', 'This section is ready for future profiles.')
    );
    return emptyState;
}

function renderMemberSections() {
    const root = document.getElementById('member-sections');

    if (!root) {
        return;
    }

    const memberSections = window.MIRAI_MEMBER_SECTIONS || {};
    root.replaceChildren();

    memberSectionConfig.forEach((sectionConfig) => {
        const members = memberSections[sectionConfig.key] || [];
        const section = document.createElement('section');
        const titleId = `members-${sectionConfig.key}-title`;
        section.className = 'member-section';
        section.setAttribute('aria-labelledby', titleId);

        const header = document.createElement('div');
        header.className = 'member-section-header';

        const title = createTextElement('h3', 'member-section-title', sectionConfig.title);
        title.id = titleId;

        const count = createTextElement(
            'span',
            'member-section-count',
            `${members.length} ${members.length === 1 ? 'member' : 'members'}`
        );

        header.append(title, count);
        section.append(header);

        if (members.length) {
            const grid = document.createElement('div');
            grid.className = 'member-grid';
            members.forEach((member) => grid.append(createMemberCard(member)));
            section.append(grid);
        } else {
            section.append(createEmptyState());
        }

        root.append(section);
    });
}

function normaliseExternalUrl(value) {
    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    return `https://${value}`;
}

function buildVisibleLinks(member) {
    return contactFields
        .map((field) => {
            const value = getText(field.getValue(member));

            if (!value) {
                return null;
            }

            const link = {
                label: field.label,
                value,
                type: field.type,
                href: field.type === 'email' ? `mailto:${value}` : normaliseExternalUrl(value),
            };

            if (field.type === 'external') {
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            }

            return link;
        })
        .filter(Boolean);
}

function createContactRow(visibleLink, member) {
    const row = document.createElement('div');
    row.className = 'member-contact-row';

    const link = document.createElement('a');
    link.className = 'member-contact-link';
    link.href = visibleLink.href;
    link.textContent = visibleLink.type === 'email' ? visibleLink.value : 'Open link';
    link.setAttribute('aria-label', `${visibleLink.label} for ${getText(member.name, 'member')}`);

    if (visibleLink.target) {
        link.target = visibleLink.target;
    }

    if (visibleLink.rel) {
        link.rel = visibleLink.rel;
    }

    row.append(createTextElement('span', 'member-contact-label', visibleLink.label), link);
    return row;
}

function createDialogSidebar(member) {
    const sidebar = document.createElement('aside');
    sidebar.className = 'member-dialog-sidebar';
    sidebar.append(createMemberAvatar(member, 'member-dialog-avatar'));

    const contactTitle = createTextElement('h4', 'member-contact-title', 'Links and Contact');
    const contactList = document.createElement('div');
    const visibleLinks = buildVisibleLinks(member);
    contactList.className = 'member-contact-list';

    if (visibleLinks.length) {
        visibleLinks.forEach((visibleLink) => contactList.append(createContactRow(visibleLink, member)));
    } else {
        contactList.append(createTextElement('p', 'member-contact-empty', 'No links available yet.'));
    }

    sidebar.append(contactTitle, contactList);
    return sidebar;
}

function createDetailSection(title, content) {
    const section = document.createElement('section');
    section.className = 'member-detail-section';
    section.append(createTextElement('h4', 'member-detail-title', title));

    if (Array.isArray(content)) {
        if (content.length) {
            const list = document.createElement('ul');
            list.className = 'interest-list';
            content.forEach((item) => {
                const interest = document.createElement('li');
                interest.textContent = item;
                list.append(interest);
            });
            section.append(list);
        } else {
            section.append(createTextElement('p', 'member-placeholder-text', 'Research interests will be added soon.'));
        }

        return section;
    }

    section.append(createTextElement('p', content ? 'member-detail-copy' : 'member-placeholder-text', content || 'Overview details will be added soon.'));
    return section;
}

function createDialogMain(member) {
    const main = document.createElement('div');
    main.className = isStaffMember(member) ? 'member-dialog-main is-staff' : 'member-dialog-main is-student';

    main.append(
        createTextElement('p', 'member-dialog-kicker', getCategoryLabel(member.category)),
        createTextElement('h3', 'member-dialog-name', getText(member.name, 'Member Name'))
    );

    getDialogMemberMeta(member).forEach((metaText) => {
        main.append(createTextElement('p', 'member-dialog-meta', metaText));
    });

    main.append(
        createDetailSection('Overview', getText(member.overview)),
        createDetailSection('Research Interests', Array.isArray(member.researchInterests) ? member.researchInterests : [])
    );

    main.querySelector('.member-dialog-name').id = 'member-dialog-title';
    return main;
}

function openMemberDialog(member) {
    const dialog = document.getElementById('member-dialog');
    const dialogContent = document.getElementById('member-dialog-content');

    if (!dialog || !dialogContent) {
        return;
    }

    dialogContent.replaceChildren(createDialogSidebar(member), createDialogMain(member));
    document.body.classList.add('dialog-open');

    if (typeof dialog.showModal === 'function') {
        dialog.showModal();
    } else {
        dialog.setAttribute('open', '');
    }
}

function closeMemberDialog() {
    const dialog = document.getElementById('member-dialog');

    if (!dialog) {
        return;
    }

    if (typeof dialog.close === 'function' && dialog.open) {
        dialog.close();
    } else {
        dialog.removeAttribute('open');
        document.body.classList.remove('dialog-open');
    }
}

document.querySelectorAll('[data-page]').forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const pageId = link.dataset.page;
        history.replaceState(null, '', `#${pageId}`);
        showPage(pageId);
    });
});

renderMemberSections();

const memberDialog = document.getElementById('member-dialog');
const memberDialogClose = document.querySelector('.dialog-close');

if (memberDialogClose) {
    memberDialogClose.addEventListener('click', closeMemberDialog);
}

if (memberDialog) {
    memberDialog.addEventListener('click', (event) => {
        if (event.target === memberDialog) {
            closeMemberDialog();
        }
    });

    memberDialog.addEventListener('close', () => {
        document.body.classList.remove('dialog-open');
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && memberDialog?.open && typeof memberDialog.close !== 'function') {
        closeMemberDialog();
    }
});

const initialPage = window.location.hash.replace('#', '') || 'home';
showPage(initialPage);
