<?php

declare(strict_types=1);

namespace Vendor\SpeechExtManual\Backend\EventListener;

use TYPO3\CMS\Backend\Template\Components\ButtonBar;
use TYPO3\CMS\Backend\Template\Components\ModifyButtonBarEvent;
use TYPO3\CMS\Core\Imaging\IconFactory;
use TYPO3\CMS\Core\Imaging\Icon;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Page\PageRenderer;

class PageLayoutListener
{
    public function __invoke(ModifyButtonBarEvent $event): void
    {
        $buttons = $event->getButtons();
        $buttonBar = $event->getButtonBar();
        $iconFactory = GeneralUtility::makeInstance(IconFactory::class);

        // Button 1 -> "normaler" button
        $speechButton = $buttonBar->makeInputButton()
            ->setName('speech-action')
            ->setTitle('Speech Input')
            ->setIcon($iconFactory->getIcon('ext-speechinput-action', Icon::SIZE_SMALL))
            ->setShowLabelText(true)
            ->setClasses('speech-action');

        // Position des buttons
        $buttons[ButtonBar::BUTTON_POSITION_LEFT][3][] = $speechButton;

        // Button 1 -> toggle button
        $toggleButton = $buttonBar->makeInputButton()
            ->setName('toggle-action')
            ->setTitle('Toggle Speech Input')
            ->setIcon($iconFactory->getIcon('ext-speechinput-action', Icon::SIZE_SMALL))
            ->setShowLabelText(true)
            ->setClasses('toggle-action');

        // Position des buttons
        $buttons[ButtonBar::BUTTON_POSITION_RIGHT][3][] = $toggleButton;

        // Buttons aktualisieren
        $event->setButtons($buttons);

        // CSS und JS für die Buttons hinzufügen
        $pageRenderer = GeneralUtility::makeInstance(PageRenderer::class);
        $pageRenderer->loadRequireJsModule('TYPO3/CMS/SpeechExtManual/SpeechInput');
        $pageRenderer->addCssFile('EXT:speech_ext_manual/Resources/Public/Styles/Styles.css');
    }
}
