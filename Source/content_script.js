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
    "The Planet's Dumbest Human",
    "No Puppet No Puppet",
    "Guy Who Still Thinks Hillary Poured Bleach On Her Emails",
    "A Man Who Will Never Know Laughter",
    "Mankind's Biggest Embarrassment",
    "Mangled Apricot Hellbeast",
    "Two Scoops Of Ice Cream Consumer",
    "Leatherfaced Piss Jar",
    "счастливого Рождества",
    "If Turd was an Ice Cream Flavor Half of America Voted For"
  ]

  const index = Math.floor(Math.random()*TRUMP_NAMES.length)
  return TRUMP_NAMES[index]
}

function getShortTrumpName () {
  const TRUMP_NAMES = [
    "John Barron/Miller",
    "Noted Historian",
    "Steve Bannon Associate",
    "Stairphobic Racist",
    "💩🍊",
    "Clueless Fart",
    "Actual Sociopath",
    "Noted Nazi Employer",
    "Sebastion v Gorka Employer",
    "Probable Russian Agent",
    "Human Sewer",
    "Unidentifiable Organism",
    "Human Imitator",
    "Coddled ManBaby",
    "Dumb Hitler",
    "Authoritarian Demogorgon",
    "Eric Trump's Father",
    "Grumpy Fascist",
    "The Planet's Dumbest Human",
    "Human Sewer",
    "Alex Jones Fan",
    "Bill O'Reilly Fan",
    "Fox and Friends Junky",
    "Dictator Fanboy",
    "Not A Reader",
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


function replaceText(v)
{
    // Fix some misspellings
    v = v.replace(/\b(P|p)resident (Donald( J\.)?)? Trump\b/g, getTrumpName());
    v = v.replace(/\b(P|p)resident (Donald)?Trump\b/g, getTrumpName());
    v = v.replace(/\b(D|d)onald\sTrump\b/g, getTrumpName());
    v = v.replace(/Trump/g, getShortTrumpName());

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
