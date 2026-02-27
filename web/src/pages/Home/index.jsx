/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useContext, useEffect, useState } from 'react';
import { API, showError } from '../../helpers';
import { StatusContext } from '../../context/Status';
import { useActualTheme } from '../../context/Theme';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import { useIsMobile } from '../../hooks/common/useIsMobile';

const CYAN = '#00d4c8';
const BLUE = '#0096ff';
const CYAN_GRADIENT = `linear-gradient(90deg, ${CYAN}, ${BLUE})`;
const BG_DARK = '#070d1a';
const BG_CARD = '#0d1a2d';
const BG_ALT = '#0a1220';
const BG_FOOTER = '#050b16';
const TEXT_PRIMARY = '#ffffff';
const TEXT_SECONDARY = '#94a3b8';
const TEXT_MUTED = '#64748b';
const BORDER_DIM = 'rgba(71, 85, 105, 0.4)';
const BORDER_CYAN = 'rgba(0, 212, 200, 0.2)';

const qualifications = [
  {
    icon: '🏅',
    title: '专精特新企业',
    desc: '省级专精特新中小企业认定，深耕算力调度技术研发，具备极高的行业专业性与创新能力。',
  },
  {
    icon: '🛡️',
    title: '高新技术企业',
    desc: '国家级高新技术企业，核心技术自主可控，多项AIGC调度专利，为企业提供技术底座保障。',
  },
  {
    icon: '📋',
    title: '区经信局备案算力平台',
    desc: '滨江区经信局首批备案AIGC公共服务平台，支持政策资金直达，确保流程合规透明。',
  },
];

const coreValues = [
  {
    icon: '⚡',
    title: '聚合接入',
    subtitle: 'MULTI-MODEL INTEGRATION',
    desc: '统一适配阿里通义、百度文心、字节豆包等国产顶尖模型。一套协议，全生态接入，大幅降低研发成本。',
  },
  {
    icon: '✅',
    title: '政策合规',
    subtitle: 'POLICY COMPLIANCE',
    desc: '毫秒级Token行为审计，支持滨江区算力券实时抵扣。全流程符合国家生成式人工智能管理办法要求。',
  },
  {
    icon: '🛠️',
    title: '专业运营',
    subtitle: 'PROFESSIONAL OPERATION',
    desc: '电鲸科技提供7×24小时技术保障与专属客服支持。协助企业完成模型备案与算力扶持资金申请。',
  },
];

const partners = ['阿里云', '火山引擎', '百度智能云', '华为昇腾', '腾讯云', '智谱AI'];

const footerLinks = [
  {
    title: '产品服务',
    items: ['模型广场', '解决方案', '算力调度', '补贴方案'],
  },
  {
    title: '开发者中心',
    items: ['API文档', 'SDK下载', '状态监控', '错误码指南'],
  },
  {
    title: '关于与合规',
    items: ['关于电鲸', '资质荣誉', '合规与备案', '服务协议'],
  },
];

const Home = () => {
  const { i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const isMobile = useIsMobile();

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);
      if (data.startsWith('https://')) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.onload = () => {
            iframe.contentWindow.postMessage({ themeMode: actualTheme }, '*');
            iframe.contentWindow.postMessage({ lang: i18n.language }, '*');
          };
        }
      }
    } else {
      showError(message);
    }
    setHomePageContentLoaded(true);
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };
    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    displayHomePageContent().then();
  }, []);

  // 如果后台配置了自定义首页内容，则显示自定义内容
  if (homePageContentLoaded && homePageContent !== '') {
    return (
      <div className='overflow-x-hidden w-full'>
        {homePageContent.startsWith('https://') ? (
          <iframe src={homePageContent} className='w-full h-screen border-none' />
        ) : (
          <div
            className='mt-[60px]'
            dangerouslySetInnerHTML={{ __html: homePageContent }}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ background: BG_DARK, color: TEXT_PRIMARY, minHeight: '100vh' }}>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />

      {/* ── Hero Section ── */}
      <section
        style={{
          background: `linear-gradient(135deg, ${BG_DARK} 0%, #0d1a2d 50%, ${BG_DARK} 100%)`,
          padding: isMobile ? '80px 24px 72px' : '140px 40px 100px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 背景光晕 */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '8%',
            width: '500px',
            height: '500px',
            background: `radial-gradient(circle, rgba(0,212,200,0.07) 0%, transparent 65%)`,
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '8%',
            width: '400px',
            height: '400px',
            background: `radial-gradient(circle, rgba(0,150,255,0.06) 0%, transparent 65%)`,
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* 备案标签 */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0,212,200,0.08)',
              border: `1px solid rgba(0,212,200,0.3)`,
              borderRadius: '20px',
              padding: '5px 16px',
              marginBottom: '36px',
              fontSize: '13px',
              color: CYAN,
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: CYAN,
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            滨江区算力券/模型券备案服务商
          </div>

          {/* 主标题 */}
          <h1
            style={{
              fontSize: isMobile ? '36px' : '68px',
              fontWeight: '800',
              lineHeight: 1.15,
              marginBottom: '20px',
              letterSpacing: '-0.02em',
            }}
          >
            <span style={{ color: TEXT_PRIMARY }}>鲸枢·AIGC算力</span>
            <br />
            <span
              style={{
                background: CYAN_GRADIENT,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              智能调度公共服务平台
            </span>
          </h1>

          {/* 副标题 */}
          <p
            style={{
              fontSize: isMobile ? '14px' : '16px',
              color: TEXT_SECONDARY,
              lineHeight: 1.8,
              marginBottom: '6px',
            }}
          >
            杭州电鲸科技匠心运营 · 链接国产大模型生态 · 助力滨江企业降本增效
          </p>
          <p
            style={{
              fontSize: isMobile ? '14px' : '16px',
              color: TEXT_SECONDARY,
              lineHeight: 1.8,
              marginBottom: '48px',
            }}
          >
            打造安全、高效、普惠的区域级AI基础设施底座。
          </p>

          {/* 操作按钮 */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link to='/console' style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: CYAN_GRADIENT,
                  border: 'none',
                  borderRadius: '8px',
                  padding: '13px 32px',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  letterSpacing: '0.01em',
                }}
              >
                免费接入测试 →
              </button>
            </Link>
            <button
              style={{
                background: 'transparent',
                border: `1px solid ${BORDER_DIM}`,
                borderRadius: '8px',
                padding: '13px 32px',
                color: '#e2e8f0',
                fontSize: '16px',
                cursor: 'pointer',
                letterSpacing: '0.01em',
              }}
              onClick={() =>
                window.open('mailto:support@whalehub.cn', '_blank')
              }
            >
              企业备案咨询 ↗
            </button>
          </div>
        </div>
      </section>

      {/* ── 合规资质 Section ── */}
      <section
        style={{
          padding: isMobile ? '64px 24px' : '88px 40px',
          background: BG_DARK,
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '52px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '14px',
                flexWrap: 'wrap',
                marginBottom: '12px',
              }}
            >
              <span
                style={{
                  fontSize: isMobile ? '22px' : '28px',
                  fontWeight: '700',
                  color: TEXT_PRIMARY,
                }}
              >
                合规资质
              </span>
              <span
                style={{
                  color: '#475569',
                  fontSize: '13px',
                  letterSpacing: '2px',
                  fontWeight: '400',
                }}
              >
                / COMPLIANCE &amp; QUALIFICATIONS
              </span>
            </div>
            <div
              style={{
                width: '40px',
                height: '3px',
                background: CYAN_GRADIENT,
                borderRadius: '2px',
              }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '24px',
            }}
          >
            {qualifications.map((card, i) => (
              <div
                key={i}
                style={{
                  background: BG_CARD,
                  border: `1px solid ${BORDER_CYAN}`,
                  borderRadius: '14px',
                  padding: '32px 28px',
                }}
              >
                <div style={{ fontSize: '34px', marginBottom: '18px' }}>
                  {card.icon}
                </div>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: TEXT_PRIMARY,
                    marginBottom: '12px',
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: TEXT_SECONDARY,
                    lineHeight: '1.75',
                  }}
                >
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 核心价值主张 Section ── */}
      <section
        style={{
          padding: isMobile ? '64px 24px' : '88px 40px',
          background: BG_ALT,
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2
              style={{
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: '700',
                color: TEXT_PRIMARY,
                marginBottom: '12px',
              }}
            >
              核心价值主张
            </h2>
            <p style={{ color: TEXT_SECONDARY, fontSize: '15px' }}>
              专业运营团队，助力政企数字化转型
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '40px',
            }}
          >
            {coreValues.map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '18px',
                    background: 'rgba(0,212,200,0.09)',
                    border: `1px solid ${BORDER_CYAN}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '30px',
                    margin: '0 auto 22px',
                  }}
                >
                  {item.icon}
                </div>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: TEXT_PRIMARY,
                    marginBottom: '4px',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: '11px',
                    color: CYAN,
                    letterSpacing: '1.5px',
                    marginBottom: '18px',
                    fontWeight: '500',
                  }}
                >
                  {item.subtitle}
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    color: TEXT_SECONDARY,
                    lineHeight: '1.75',
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 深度合作厂商 Section ── */}
      <section
        style={{
          padding: isMobile ? '64px 24px' : '88px 40px',
          background: BG_DARK,
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <h2
              style={{
                fontSize: isMobile ? '22px' : '28px',
                fontWeight: '700',
                color: TEXT_PRIMARY,
                marginBottom: '8px',
              }}
            >
              深度合作厂商
            </h2>
            <p
              style={{
                color: '#475569',
                fontSize: '13px',
                letterSpacing: '2.5px',
              }}
            >
              ECOSYSTEM PARTNERS
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '16px',
            }}
          >
            {partners.map((partner, i) => (
              <div
                key={i}
                style={{
                  background: BG_CARD,
                  border: `1px solid ${BORDER_DIM}`,
                  borderRadius: '10px',
                  padding: '14px 36px',
                  color: TEXT_SECONDARY,
                  fontSize: '15px',
                  fontWeight: '500',
                }}
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          background: BG_FOOTER,
          borderTop: `1px solid ${BORDER_DIM}`,
          padding: isMobile ? '48px 24px 28px' : '64px 40px 36px',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr',
              gap: '40px',
              marginBottom: '48px',
            }}
          >
            {/* 公司信息 */}
            <div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  background: CYAN_GRADIENT,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block',
                }}
              >
                WhaleHub 鲸枢
              </div>
              <p
                style={{
                  fontSize: '13px',
                  color: TEXT_MUTED,
                  lineHeight: '2',
                }}
              >
                运营主体：杭州电鲸网络科技有限公司
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: '#475569',
                  marginBottom: '20px',
                  lineHeight: '1.8',
                }}
              >
                滨江区AIGC算力公共服务平台备案运营商 | 专精特新企业
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: TEXT_MUTED,
                  lineHeight: '2',
                }}
              >
                地址：杭州市滨江区春风大楼10幢6层
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: TEXT_MUTED,
                  lineHeight: '2',
                }}
              >
                联系电话：0571-81902889
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: TEXT_MUTED,
                  lineHeight: '2',
                }}
              >
                邮件：support@whalehub.cn
              </p>
            </div>

            {/* 链接列 */}
            {footerLinks.map((col, ci) => (
              <div key={ci}>
                <h4
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#e2e8f0',
                    marginBottom: '18px',
                  }}
                >
                  {col.title}
                </h4>
                {col.items.map((item, ii) => (
                  <p
                    key={ii}
                    style={{
                      fontSize: '13px',
                      color: TEXT_MUTED,
                      lineHeight: '2.4',
                      cursor: 'default',
                    }}
                  >
                    {item}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* 底部版权 */}
          <div
            style={{
              borderTop: `1px solid ${BORDER_DIM}`,
              paddingTop: '28px',
              textAlign: 'center',
              fontSize: '12px',
              color: '#475569',
            }}
          >
            © 2025 杭州电鲸网络科技有限公司 · All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
