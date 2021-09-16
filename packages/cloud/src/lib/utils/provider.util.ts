/*******************************************************************************
 * Copyright (c) 2021. Rex Isaac Raphael
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * File name:         provider.util.ts
 * Last modified:     11/02/2021, 01:27
 ******************************************************************************/
import {
  LocalRegistryProviderOptions,
  RegistryConfiguration,
} from '../interfaces';
import {
  SERVICE_REGISTRY_CONFIG,
  ServiceStore,
} from '@ultimate-backend/common';
import { Provider } from '@nestjs/common';
import { MdnsServiceRegistry } from '../discoveries';
import { validateOptions } from './validate-options';
import { loadPackage } from '@nestjs/common/utils/load-package.util';

export function getSharedProviderUtils(
  options: RegistryConfiguration
): Array<Provider> {
  const registryOption = validateOptions(options);

  const sharedProviders = [];
  const configProvider = {
    provide: SERVICE_REGISTRY_CONFIG,
    useValue: {},
  };

  if (registryOption.discoverer === 'consul') {
    const importPackage = loadPackage(
      '@ultimate-backend/consul',
      '@ultimate-backend/consul',
      () => require('@ultimate-backend/consul')
    );

    configProvider.useValue = {
      service: options.service,
      discovery: {
        failFast: true,
        ...options.discovery,
      },
      heartbeat: options.heartbeat,
    };

    sharedProviders.push(importPackage.ConsulServiceRegistry);
    sharedProviders.push(importPackage.ConsulDiscoveryClient);
  } else if (registryOption.discoverer === 'etcd') {
    const importPackage = loadPackage(
      '@ultimate-backend/etcd',
      '@ultimate-backend/etcd',
      () => require('@ultimate-backend/etcd')
    );

    configProvider.useValue = {
      service: options.service,
      discovery: {
        failFast: true,
        ...options.discovery,
      },
      heartbeat: options.heartbeat,
    };

    sharedProviders.push(importPackage.EtcdServiceRegistry);
    sharedProviders.push(importPackage.EtcdDiscoveryClient);
  } else if (registryOption.discoverer === 'zookeeper') {
    const importPackage = loadPackage(
      '@ultimate-backend/zookeeper',
      '@ultimate-backend/zookeeper',
      () => require('@ultimate-backend/zookeeper')
    );

    configProvider.useValue = {
      service: options.service,
      discovery: {
        failFast: true,
        ...options.discovery,
      },
      heartbeat: options.heartbeat,
    };

    sharedProviders.push(importPackage.ZookeeperServiceRegistry);
    sharedProviders.push(importPackage.ZookeeperDiscoveryClient);
  } else if (registryOption.discoverer === 'local') {
    configProvider.useValue = {
      service: options.service,
      discovery: options.discovery,
      heartbeat: options.heartbeat,
    } as LocalRegistryProviderOptions;

    sharedProviders.push(MdnsServiceRegistry);
  }

  sharedProviders.push(configProvider);
  sharedProviders.push(ServiceStore);

  return sharedProviders;
}