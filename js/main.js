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

const publicationTypeOrder = ['Journal', 'Conference', 'Preprint', 'Workshop', 'Other'];
let selectedPublicationYear = null;

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

function getPublications() {
    return Array.isArray(window.MIRAI_PUBLICATIONS) ? window.MIRAI_PUBLICATIONS : [];
}

function getPublicationYears(publications) {
    return [...new Set(
        publications
            .map((publication) => Number(publication.year))
            .filter((year) => Number.isFinite(year))
    )].sort((left, right) => right - left);
}

function getPublicationTypeGroup(type) {
    const typeText = getText(type, 'Other');
    return publicationTypeOrder.includes(typeText) ? typeText : 'Other';
}

function getPublicationTypeHeading(type) {
    const headings = {
        Journal: 'Journal Papers',
        Conference: 'Conference Papers',
        Preprint: 'Preprints',
        Workshop: 'Workshop Papers',
        Other: 'Other Publications',
    };

    return headings[type] || `${type} Publications`;
}

function groupPublicationsByYear(publications) {
    return publications.reduce((groups, publication) => {
        const year = Number(publication.year);

        if (!Number.isFinite(year)) {
            return groups;
        }

        if (!groups[year]) {
            groups[year] = [];
        }

        groups[year].push(publication);
        return groups;
    }, {});
}

function groupPublicationsByType(publications) {
    return publications.reduce((groups, publication) => {
        const type = getPublicationTypeGroup(publication.type);

        if (!groups[type]) {
            groups[type] = [];
        }

        groups[type].push(publication);
        return groups;
    }, {});
}

function comparePublications(left, right) {
    const yearDifference = Number(right.year) - Number(left.year);

    if (yearDifference !== 0) {
        return yearDifference;
    }

    const leftTypeIndex = publicationTypeOrder.indexOf(getPublicationTypeGroup(left.type));
    const rightTypeIndex = publicationTypeOrder.indexOf(getPublicationTypeGroup(right.type));

    if (leftTypeIndex !== rightTypeIndex) {
        return leftTypeIndex - rightTypeIndex;
    }

    return getText(left.title).localeCompare(getText(right.title));
}

function isExternalUrl(value) {
    return /^https?:\/\//i.test(value);
}

function getPublicationHref(value) {
    const href = getText(value);

    if (!href) {
        return '';
    }

    if (/^(https?:|mailto:|#|\.?\.?\/)/i.test(href)) {
        return href;
    }

    return normaliseExternalUrl(href);
}

function createPublicationFilterButton(value, label) {
    const button = document.createElement('button');
    const isActive = String(selectedPublicationYear) === String(value);
    button.type = 'button';
    button.className = 'publication-filter-button';
    button.textContent = label;
    button.setAttribute('aria-pressed', String(isActive));
    button.classList.toggle('active', isActive);
    button.addEventListener('click', () => {
        selectedPublicationYear = value;
        renderPublicationPage();
    });
    return button;
}

function closePublicationMoreDropdowns() {
    document.querySelectorAll('.publication-more-dropdown.open').forEach((dropdown) => {
        const button = dropdown.querySelector('.publication-more-button');
        dropdown.classList.remove('open');

        if (button) {
            button.setAttribute('aria-expanded', 'false');
        }
    });
}

function createPublicationMoreDropdown(olderYears) {
    const dropdown = document.createElement('div');
    const menuId = 'publication-more-years-menu';
    const isOlderYearActive = olderYears.map(String).includes(String(selectedPublicationYear));
    dropdown.className = 'publication-more-dropdown';
    dropdown.classList.toggle('active', isOlderYearActive);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'publication-more-button';
    button.textContent = 'MORE YEARS';
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', menuId);

    const menu = document.createElement('div');
    menu.id = menuId;
    menu.className = 'publication-more-menu';
    menu.setAttribute('role', 'listbox');
    menu.setAttribute('aria-label', 'More publication years');

    olderYears.forEach((year) => {
        const option = document.createElement('button');
        const isSelected = Number(selectedPublicationYear) === Number(year);
        option.type = 'button';
        option.className = 'publication-more-option';
        option.textContent = String(year);
        option.setAttribute('role', 'option');
        option.setAttribute('aria-selected', String(isSelected));
        option.classList.toggle('active', isSelected);
        option.addEventListener('click', () => {
            selectedPublicationYear = Number(year);
            closePublicationMoreDropdowns();
            renderPublicationPage();
        });
        menu.append(option);
    });

    button.addEventListener('click', (event) => {
        event.stopPropagation();
        const shouldOpen = !dropdown.classList.contains('open');
        closePublicationMoreDropdowns();
        dropdown.classList.toggle('open', shouldOpen);
        button.setAttribute('aria-expanded', String(shouldOpen));
    });

    dropdown.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closePublicationMoreDropdowns();
            button.focus();
        }
    });

    dropdown.append(button, menu);
    return dropdown;
}

function renderPublicationYearFilter(years) {
    const root = document.getElementById('publication-year-filter');

    if (!root) {
        return;
    }

    root.replaceChildren();

    if (!years.length) {
        return;
    }

    const visibleYears = years.slice(0, 5);
    const olderYears = years.slice(5);

    visibleYears.forEach((year) => {
        root.append(createPublicationFilterButton(year, String(year)));
    });

    if (olderYears.length) {
        root.append(createPublicationMoreDropdown(olderYears));
    }
}

function createPublicationImagePlaceholder(publication) {
    const placeholder = document.createElement('div');
    placeholder.className = 'publication-image-placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.textContent = getText(publication.type, 'Publication');
    return placeholder;
}

function createPublicationMedia(publication) {
    const media = document.createElement('div');
    media.className = 'publication-card-media';

    if (publication.image) {
        const image = document.createElement('img');
        image.src = publication.image;
        image.alt = `Thumbnail for ${getText(publication.title, 'publication')}`;
        image.loading = 'lazy';
        image.addEventListener('error', () => {
            media.replaceChildren(createPublicationImagePlaceholder(publication));
        });
        media.append(image);
    } else {
        media.append(createPublicationImagePlaceholder(publication));
    }

    return media;
}

function createPublicationVenueLogo(publication) {
    if (!publication.venueLogo) {
        return null;
    }

    const logo = document.createElement('img');
    logo.className = 'publication-venue-logo';
    logo.src = publication.venueLogo;
    logo.alt = `${getText(publication.venue, publication.type || 'Venue')} logo`;
    logo.loading = 'lazy';
    logo.addEventListener('error', () => {
        logo.remove();
    });

    return logo;
}

function createPublicationMeta(publication) {
    const metaItems = [
        getText(publication.type, 'Publication'),
        getText(publication.venue),
        Number.isFinite(Number(publication.year)) ? String(publication.year) : '',
    ].filter(Boolean);

    return createTextElement('p', 'publication-card-meta', metaItems.join(' / '));
}

function createPublicationTags(publication) {
    if (!Array.isArray(publication.tags) || !publication.tags.length) {
        return null;
    }

    const tags = document.createElement('div');
    tags.className = 'publication-tags';

    publication.tags.forEach((tag) => {
        const tagText = getText(tag);

        if (tagText) {
            tags.append(createTextElement('span', 'publication-tag', tagText));
        }
    });

    return tags.childElementCount ? tags : null;
}

function buildPublicationLinks(publication) {
    const configuredLinks = Array.isArray(publication.links) ? publication.links : [];
    const findLinkByLabel = (label) => configuredLinks.find((link) => getText(link.label).toLowerCase() === label);
    const paperUrl = publication.url || findLinkByLabel('paper')?.url;
    const codeUrl = findLinkByLabel('code')?.url;

    return [
        {
            label: 'Paper',
            url: paperUrl,
        },
        {
            label: 'Code',
            url: codeUrl,
        },
    ]
        .map((link) => {
            const href = getPublicationHref(link.url);
            const label = getText(link.label, 'Link');

            if (!href) {
                return null;
            }

            return { href, label };
        })
        .filter(Boolean);
}

function createPublicationLinks(publication) {
    const links = buildPublicationLinks(publication);

    if (!links.length) {
        return null;
    }

    const linkList = document.createElement('div');
    linkList.className = 'publication-card-links';
    linkList.setAttribute('aria-label', `Links for ${getText(publication.title, 'publication')}`);

    links.forEach((publicationLink) => {
        const link = document.createElement('a');
        link.className = 'publication-card-link';
        link.href = publicationLink.href;
        link.textContent = publicationLink.label;

        if (isExternalUrl(publicationLink.href)) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }

        linkList.append(link);
    });

    return linkList;
}

function createPublicationCard(publication) {
    const card = document.createElement('article');
    card.className = 'publication-card';

    const body = document.createElement('div');
    body.className = 'publication-card-body';

    const header = document.createElement('div');
    header.className = 'publication-card-header';

    const venueLogo = createPublicationVenueLogo(publication);

    if (venueLogo) {
        header.append(venueLogo);
    }

    const title = createTextElement('h4', 'publication-card-title', getText(publication.title, 'Publication title'));
    const authors = createTextElement('p', 'publication-card-authors', getText(publication.authors, 'Authors to be added'));
    const award = getText(publication.award);
    const tags = createPublicationTags(publication);
    const links = createPublicationLinks(publication);

    header.append(createPublicationMeta(publication));
    body.append(header, title, authors);

    if (award) {
        body.append(createTextElement('span', 'publication-award', award));
    }

    if (tags) {
        body.append(tags);
    }

    if (links) {
        body.append(links);
    }

    card.append(createPublicationMedia(publication), body);
    return card;
}

function createPublicationTypeSection(type, publications) {
    const section = document.createElement('section');
    section.className = 'publication-type-section';
    section.append(createTextElement('h4', 'publication-type-title', getPublicationTypeHeading(type)));

    const list = document.createElement('div');
    list.className = 'publication-card-list';
    publications.forEach((publication) => list.append(createPublicationCard(publication)));
    section.append(list);

    return section;
}

function createPublicationYearSection(year, publications) {
    const section = document.createElement('section');
    const titleId = `publications-${year}-title`;
    section.className = 'publication-year-section';
    section.setAttribute('aria-labelledby', titleId);

    const header = document.createElement('div');
    header.className = 'publication-year-header';

    const title = createTextElement('h3', 'publication-year-title', String(year));
    title.id = titleId;

    const count = createTextElement(
        'span',
        'publication-year-count',
        `${publications.length} ${publications.length === 1 ? 'publication' : 'publications'}`
    );

    header.append(title, count);
    section.append(header);

    const typeGroups = groupPublicationsByType(publications.sort(comparePublications));
    publicationTypeOrder
        .filter((type) => Array.isArray(typeGroups[type]) && typeGroups[type].length)
        .forEach((type) => {
            section.append(createPublicationTypeSection(type, typeGroups[type]));
        });

    return section;
}

function createPublicationEmptyState() {
    const emptyState = document.createElement('div');
    emptyState.className = 'publication-empty-state';
    emptyState.append(
        createTextElement('p', 'publication-empty-title', 'Publications will be added soon.'),
        createTextElement('p', 'publication-empty-copy', 'This section is ready for future publication records.')
    );
    return emptyState;
}

function renderPublicationList(publications) {
    const root = document.getElementById('publication-list');

    if (!root) {
        return;
    }

    root.replaceChildren();

    if (!publications.length) {
        root.append(createPublicationEmptyState());
        return;
    }

    const publicationsByYear = groupPublicationsByYear(publications.sort(comparePublications));
    Object.keys(publicationsByYear)
        .map(Number)
        .sort((left, right) => right - left)
        .forEach((year) => {
            root.append(createPublicationYearSection(year, publicationsByYear[year]));
        });
}

function renderPublicationPage() {
    const publications = getPublications().slice().sort(comparePublications);
    const years = getPublicationYears(publications);

    if (!years.length) {
        selectedPublicationYear = null;
        renderPublicationYearFilter(years);
        renderPublicationList([]);
        return;
    }

    if (!years.includes(Number(selectedPublicationYear))) {
        selectedPublicationYear = years[0];
    }

    renderPublicationYearFilter(years);
    renderPublicationList(publications.filter((publication) => Number(publication.year) === Number(selectedPublicationYear)));
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
renderPublicationPage();

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

document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element) || !event.target.closest('.publication-more-dropdown')) {
        closePublicationMoreDropdowns();
    }
});

const initialPage = window.location.hash.replace('#', '') || 'home';
showPage(initialPage);
