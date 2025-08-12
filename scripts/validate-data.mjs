#!/usr/bin/env node

/**
 * Data Validation Script
 * Validates all JSON data files for proper structure and completeness
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

const dataFiles = [
  'astrology.json',
  'fengshui.json',
  'iching.json',
  'numerology.json',
  'palmistry.json',
  'tarot.json'
];

const validateFile = (filename) => {
  try {
    console.log(chalk.blue(`\n📋 Validating ${filename}...`));
    
    const filePath = join(process.cwd(), 'src', 'mastra', 'data', filename);
    const content = readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    let issues = [];
    let warnings = [];
    
    switch (filename) {
      case 'astrology.json':
        if (!data.westernAstrology?.zodiacSigns) {
          issues.push('Missing westernAstrology.zodiacSigns');
        } else if (data.westernAstrology.zodiacSigns.length !== 12) {
          issues.push(`Expected 12 zodiac signs, found ${data.westernAstrology.zodiacSigns.length}`);
        }
        
        if (!data.chineseAstrology?.animals) {
          issues.push('Missing chineseAstrology.animals');
        } else if (data.chineseAstrology.animals.length !== 12) {
          issues.push(`Expected 12 Chinese zodiac animals, found ${data.chineseAstrology.animals.length}`);
        }
        break;
        
      case 'tarot.json':
        if (!data.majorArcana) {
          issues.push('Missing majorArcana');
        } else if (data.majorArcana.length !== 22) {
          issues.push(`Expected 22 Major Arcana cards, found ${data.majorArcana.length}`);
        }
        break;
        
      case 'iching.json':
        if (!data.hexagrams) {
          issues.push('Missing hexagrams');
        } else if (data.hexagrams.length !== 64) {
          issues.push(`Expected 64 hexagrams, found ${data.hexagrams.length}`);
        }
        break;
        
      case 'numerology.json':
        if (!data.numberMeanings) {
          issues.push('Missing numberMeanings');
        }
        break;
        
      case 'palmistry.json':
        if (!data.lines) {
          warnings.push('Missing palm lines data');
        }
        break;
        
      case 'fengshui.json':
        if (!data.directions) {
          issues.push('Missing directions data');
        }
        break;
    }
    
    if (Object.keys(data).length === 0) {
      issues.push('File is empty or contains no valid data');
    }
    
    if (issues.length === 0) {
      console.log(chalk.green('  ✅ File structure is valid'));
    } else {
      console.log(chalk.red('  ❌ Issues found:'));
      issues.forEach(issue => console.log(chalk.red(`    • ${issue}`)));
    }
    
    if (warnings.length > 0) {
      console.log(chalk.yellow('  ⚠️  Warnings:'));
      warnings.forEach(warning => console.log(chalk.yellow(`    • ${warning}`)));
    }
    
    const fileSize = (content.length / 1024).toFixed(2);
    console.log(chalk.gray(`  📊 File size: ${fileSize} KB`));
    
    return {
      filename,
      valid: issues.length === 0,
      issues: issues.length,
      warnings: warnings.length,
      size: fileSize
    };
    
  } catch (error) {
    console.log(chalk.red(`  ❌ Failed to validate: ${error.message}`));
    return {
      filename,
      valid: false,
      issues: 1,
      warnings: 0,
      error: error.message
    };
  }
};

const main = () => {
  console.log(chalk.blue.bold('🔍 Fortune Telling Agent - Data Validation'));
  console.log(chalk.gray('Checking all JSON data files for proper structure...\n'));
  
  const results = dataFiles.map(validateFile);
  
  console.log(chalk.blue.bold('\n📊 Validation Summary'));
  console.log('━'.repeat(50));
  
  const validFiles = results.filter(r => r.valid).length;
  const totalIssues = results.reduce((sum, r) => sum + r.issues, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings, 0);
  
  console.log(`Total files: ${results.length}`);
  console.log(chalk.green(`Valid files: ${validFiles}`));
  
  if (totalIssues > 0) {
    console.log(chalk.red(`Issues found: ${totalIssues}`));
  }
  
  if (totalWarnings > 0) {
    console.log(chalk.yellow(`Warnings: ${totalWarnings}`));
  }
  
  results.forEach(result => {
    const status = result.valid ? chalk.green('✅') : chalk.red('❌');
    console.log(`${status} ${result.filename}`);
  });
  
  if (totalIssues === 0) {
    console.log(chalk.green.bold('\n🎉 All data files are valid!'));
  } else {
    console.log(chalk.red.bold('\n⚠️  Please fix the issues above before running the agent.'));
    process.exit(1);
  }
};

main();
