<?php

$EM_CONF[$_EXTKEY] = [
    'title' => 'Speech control Extension',
    'description' => 'Eine TYPO3 Extension zur Sprachsteuerung im Backend.',
    'category' => 'plugin',
    'author' => 'Michael Helthuis',
    'author_email' => 'Grill.Panda@web.de',
    'state' => 'beta',
    'clearCacheOnLoad' => 1,
    'version' => '1.0.0-beta.1',
    'constraints' => [
        'depends' => [
            'typo3' => '12.4.0-12.4.99',
        ],
        'conflicts' => [],
        'suggests' => [],
    ],
];
