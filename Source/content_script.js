function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;

    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
  textNode.nodeValue = replaceText(textNode.nodeValue);
}

function getTrumpAdminNames() {
  const TRUMP_NAMES = [
    "Pack Of Sociopaths",
    "Billionaire Parasites",
    "Soulless Vampires",
    "Dregs Of Humanity",
    "Mediocre Liars",
    "A Legitimate Reason To Question Evolution",
    "Minions Of Mordred",
    "Poor Killers",
    "Sean Spicer's Emergency Contacts",
    "Fucking House of Hours",
    "Horde of Racists",
    "White Guys Mostly Named Steve",
    "The Horse Steves Of The Apocalypse",
    "🇷🇺Probably The Russian Government🇷🇺",
    "Putin's Patsies"
  ]

  const index = Math.floor(Math.random()*TRUMP_NAMES.length)
  return TRUMP_NAMES[index]
}

function getTrumpName() {
  const TRUMP_NAMES = [
    "A Barely Sentient Sack of Festering Racism",
    "A Sentient YouTube Comment",
    "A Congealed Ball of Flushable Wipes That Got Stuck In A Sewer",
    "Actually The Most Humble",
    "This Scotch Tape Tie Fuck",
    "The Inspiration To My Nihilism",
    "Popular Vote Loser",
    "Like Syphilis Got Syphilis and Became Corporeal",
    "Cheeto-Faced, Ferret Wearing ShitGibbon",
    "No Puppet No Puppet",
    "Guy Who Ruined House Of Cards By Being An Absurd Fascist",
    "Guy Who Still Thinks Hillary Poured Bleach On Her Emails",
    "Guy Who Probably Understands Object Permanence",
    "A Man Who Will Never Know Laughter",
    "Man Who Can Name Most Of His Kids",
    "Mankind's Biggest Embarrassment",
    "Mangled Apricot Hellbeast",
    "Two Scoops Of Ice Cream Consumer",
    "Temperate Man Who Can End Civilization",
    "A Real Bad Acid Trip",
    "Leatherfaced Piss Jar",
    "Short Fingered Vulgarian",
    "Not The Sharpest Knife In The Drawer (a phrase i just came up with)",
    "A Word Salad With Just A Few Ingredients",
    "счастливого Рождества",
    "If Turd Was An Ice Cream Flavor Half Of America Voted For",
    "Two Corinthians Is The Most"
  ]

  const index = Math.floor(Math.random()*TRUMP_NAMES.length)
  return TRUMP_NAMES[index]
}

function getShortTrumpName () {
  const TRUMP_NAMES = [
    "John Barron/Miller",
    "Noted Historian",
    "Well Done Steak",
    "Steve Bannon Associate",
    "Stairphobic Racist",
    "💩🍊",
    "Clueless Fart",
    "Obvious Glitch In The Matrix",
    "Actual Sociopath",
    "Sebastion v Gorka Employer",
    "Probable Russian Agent",
    "Human Sewer",
    "Human Imitator",
    "Coddled Man Baby",
    "Dumb Hitler",
    "An Ivanka Stalker",
    "Authoritarian Demogorgon",
    "Eric Trump's Father",
    "Grumpy Fascist",
    "The Planet's Dumbest Human",
    "Human Sewer",
    "Alex Jones Guest",
    "Fox and Friends Junky",
    "Dictator Fanboy",
    "Clearly Not A Reader",
    "Liar And/Or Idiot",
    "Real Loser",
    "Turd",
    "Bad Human",
    "Racist Dick",
    "Waste of A Toupé",
    "Dipshit",
    "Fucker",
    "Trogolodyte",
    "Jackshit"
  ]

  const index = Math.floor(Math.random()*TRUMP_NAMES.length)
  return TRUMP_NAMES[index]
}
function getTwitter() {
  const TRUMP_NAMES = [
    "realDickJCock",
    "realDickJohnCock",
    "realDickTwitterShouldBan",
    "realPieceOfWork",
    "real🇷🇺"
    "real💩"
  ]

  const index = Math.floor(Math.random()*TRUMP_NAMES.length)
  return TRUMP_NAMES[index]
}


function replaceText(v)
{
    // Fix some misspellings
    v = v.replace(/\brealDonaldTrump\b/g, getTwitter());
    v = v.replace(/\b(P|p)resident\s(Donald(\sJ(ohn)?(.)?)?\s)?Trump\b/g, getTrumpName());
    v = v.replace(/\bTrump\sAdministration\b/g, getTrumpAdminNames());
    v = v.replace(/\bTrump\s(c|C)ampaign\b/g, getTrumpAdminNames());
    v = v.replace(/(Mr.)?(Donald(\sJ(\.)?)?\s)?(\s|^)?Trump/g, ' ' + getShortTrumpName());

    return v;
}

// Returns true if a node should *not* be altered in any way
function isForbiddenNode(node) {
    return node.isContentEditable || // DraftJS and many others
    (node.parentNode && node.parentNode.isContentEditable) || // Special case for Gmail
    (node.tagName && (node.tagName.toLowerCase() == "textarea" || // Some catch-alls
                     node.tagName.toLowerCase() == "input"));
}

// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i, node;

    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            node = mutation.addedNodes[i];
            if (isForbiddenNode(node)) {
                // Should never operate on user-editable content
                continue;
            } else if (node.nodeType === 3) {
                // Replace the text for text nodes
                handleText(node);
            } else {
                // Otherwise, find text nodes within the given node and replace text
                walk(node);
            }
        }
    });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;

    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = replaceText(doc.title);

    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}
walkAndObserve(document);
