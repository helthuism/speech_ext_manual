<?php
use TYPO3\CMS\Core\Imaging\IconRegistry;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Page\PageRenderer;

defined('TYPO3') or die();

call_user_func(function () {
    // Icon-Registrierung
    $iconRegistry = GeneralUtility::makeInstance(IconRegistry::class);
    $iconRegistry->registerIcon(
        'ext-speechinput-action',
        \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
        ['source' => 'EXT:speech_ext_manual/Resources/Public/Icons/speechIcon.svg']
    );
});
